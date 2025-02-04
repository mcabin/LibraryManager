import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Book, BookCover,  } from '../../entities/book.entity';
import { detectYear } from '../../entities/misc.entiy';

@Injectable({
  providedIn: 'root'
})
export class ExternalBookService {

  private apiUrl: string = 'https://openlibrary.org';
  private maxResults: number = 40;
  constructor(private http: HttpClient, private router: Router) { }


  async searchByTitle(title: string): Promise<Book[] > {
    title = title.replaceAll(' ', '+');
    let booksList: Book[] = [];

    try {
      const request = `${this.apiUrl}/search.json?title=${title}&sort=editions&limit=${this.maxResults}`;
      await firstValueFrom(this.http.get<any>(request)).then((response: any) => {
        console.log(response)
        let responseBooksList = response.docs;
        responseBooksList.forEach((currentResponseBook: any) => {
          let newBook:Book|null=this.parseBook(currentResponseBook);
          if(newBook)
            booksList.push(newBook);
        });
      })
    }
    catch (err: unknown) {
      console.error(err)
    }
    return booksList;
  }

  async getAuthorName(key:string): Promise<string|null>{
    let name=null;
    let request:string=`${this.apiUrl}${key}.json`;
    
    await firstValueFrom(this.http.get<any>(request)).then((response: any) => {
      name=response.name;
    })

    return name;
  }


  async searchByWorkId(id: string): Promise<Book | null> {
    let bookResponse: Book | null = null;

    try {
        // URLs pour les requêtes API
        const requestWork = `${this.apiUrl}/works/${id}.json`;
        const requestEditions = `${this.apiUrl}/works/${id}/editions.json`;

        // Récupérer les informations du travail (work)
        const work = await firstValueFrom(this.http.get<any>(requestWork));

        // Vérifier si le travail existe
        if (!work) {
            console.warn("Aucun travail trouvé pour l'ID :", id);
            return null;
        }

        // Initialiser les variables pour les métadonnées du livre
        let oldestDate = Number.MAX_VALUE; // Année de publication la plus ancienne
        let totalPages = 0; // Total des pages pour calculer la moyenne
        let editionCount = 0; // Nombre d'éditions avec des pages valides
        let cover: BookCover | null = null; // Couverture du livre

        // Récupérer les éditions du travail
        const editionsResponse = await firstValueFrom(this.http.get<any>(requestEditions));
        const editions = editionsResponse.entries;

        let coversIdList:string[]=[];
        // Parcourir les éditions pour extraire les informations
        for (const currentEdition of editions) {
            // Détecter l'année de publication la plus ancienne
            if (currentEdition.publish_date) {
                const year = detectYear(currentEdition.publish_date);
                if (year) {
                    oldestDate = Math.min(oldestDate, year);
                }
            }

            // Calculer la moyenne du nombre de pages
            if (currentEdition.number_of_pages) {
                totalPages += currentEdition.number_of_pages;
                editionCount++;
            }

            // Récupérer la couverture si elle n'a pas encore été trouvée
            if (currentEdition.covers && !cover) {
                const coverId = currentEdition.covers[0];
                coversIdList.push(coverId);
            }
        }

        const randomCoverId:string=coversIdList[Math.floor(Math.random()*coversIdList.length)];
        cover = new BookCover(
          `https://covers.openlibrary.org/b/id/${randomCoverId}-M.jpg`,
          `https://covers.openlibrary.org/b/id/${randomCoverId}-L.jpg`
        );
        // Vérifier si une couverture a été trouvée
        if (!cover) {
            console.warn("Aucune couverture trouvée pour l'ID :", id);
            return null;
        }
        // Calculer la moyenne du nombre de pages
        const averagePages = editionCount > 0 ? Math.round(totalPages / editionCount) : 0;

        // Récupérer les noms des auteurs
        const authorsKey = work.authors;
        const authorsList: string[] = [];

        if (!authorsKey) {
            console.warn("Aucun auteur trouvé pour l'ID :", id);
            return null;
        }

        // Parcourir les auteurs et récupérer leurs noms
        for (const authorKey of authorsKey) {
            if (authorKey.author?.key) {
                const authorName = await this.getAuthorName(authorKey.author.key);
                if (authorName) {
                    authorsList.push(authorName);
                }
            }
        }

        // Vérifier si le titre est disponible
        const title = work.title;
        if (!title) {
            console.warn("Aucun titre trouvé pour l'ID :", id);
            return null;
        }

        // Récupérer le sous-titre (s'il existe)
        const subTitle = work.subTitle || '';

        // Récupérer la description (ou une valeur par défaut)
        let description = work.description || 'Description indisponible.';
        if(typeof description!=='string'){
          description=description.value;
        }
        // Vérifier si l'ID du travail est disponible
        let workId:string = work.key;
        if (!workId) {
            console.warn("Aucun ID de travail trouvé pour l'ID :", id);
            return null;
        }
        workId=workId.replace('/works/','');

        // Créer l'objet Book avec les informations récupérées
        bookResponse = new Book(
            title,
            subTitle,
            authorsList,
            workId,
            cover,
            description,
            oldestDate,
            averagePages
        );
    } catch (err) {
        console.error("Erreur lors de la recherche du livre :", err);
    }

    return bookResponse;
}
  
  async searchByAuthor(author: string) :Promise<Book[]>{
    author = author.replace(' ', '+');
    let booksList: Book[] = [];
    try {
      const request = `${this.apiUrl}/search.json?author=${author}&sort=editions&limit=${this.maxResults}`;
      await firstValueFrom(this.http.get<any>(request)).then((response: any) => {
        let responseBooksList = response.items;
        responseBooksList.forEach((currentResponseBook: any) => {
          let newBook:Book|null=this.parseBook(currentResponseBook);
          if(newBook)
            booksList.push(newBook);
        });
      })
    }
    catch (err: unknown) {
      console.error(err)
    }
    return booksList;

  }

  private parseBook(rawBook: any): Book | null {
    // Extraction des propriétés avec déstructuration
    const {
      title,
      author_name: authors,
      first_publish_year: publishYear,
      cover_edition_key: coverEdition,
      key: id,
      number_of_pages_median: numberPage,
      description
    } = rawBook;
  
    // Validation des champs obligatoires
    if (!title || !authors || !publishYear || !coverEdition || !id) {
      console.warn('Champ obligatoire manquant dans rawBook:', rawBook);
      return null;
    }

    // Création de la couverture du livre
    const newBookCover = this.createBookCover(coverEdition);
  
    // Nettoyage de l'ID
    const cleanedId = id.replace('/works/', '');
  
    // Gestion des champs optionnels
    const bookDescription = description || 'Pas de description disponible !';

    const bookNumberPage=numberPage|| 0;
  
    // Création et retour de l'objet Book
    return new Book(
      title,
      '', // Champ vide (si nécessaire)
      authors,
      cleanedId,
      newBookCover,
      bookDescription,
      publishYear,
      bookNumberPage
    );
  }
  
  // Méthode pour créer un objet BookCover
  private createBookCover(coverEdition: string): BookCover {
    const baseUrl = 'https://covers.openlibrary.org/b/olid';
    return new BookCover(
      `${baseUrl}/${coverEdition}-M.jpg`, // URL de la couverture moyenne
      `${baseUrl}/${coverEdition}-L.jpg`  // URL de la couverture grande
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Book, BookReadState, BookRequest, BookResponse, RatingInfo, UserInfo } from '../../entities/book.entity';
import { API_LINK } from '../../app.constant';
import { AuthentificationService } from './authentification.service';
import { ExternalBookService } from './external-book.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${API_LINK}/book`;
  constructor(private http: HttpClient, private router: Router, private authService: AuthentificationService, private externApi: ExternalBookService) { };

  async createBook(book: Book) {
    const username: string | null = this.authService.getName();
    if (username && book.userInfo) {
      const bookRequest: BookRequest = {
        apiId: book.apiId,
        title: book.title,
        author: book.authors[0],
        readPageNb: 0,
        state: book.userInfo.readState,
        date: book.userInfo.date,
        creatorUsername: username,
        note: book.userInfo.rating
      }
      this.http.post<BookResponse>(`${this.apiUrl}`, bookRequest).subscribe({
        next: (response) => {
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  async getRating(bookId: string): Promise<RatingInfo | null> {
    try {
      const response = await firstValueFrom(this.http.get<RatingInfo>(`${this.apiUrl}/rating/${bookId}`));
      return response || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  async getUserRating(bookId: string): Promise<UserInfo | null> {
    const username: string | null = this.authService.getName();
    if (!username) {
      return null;
    }

    try {
      const response = await firstValueFrom(this.http.get<UserInfo>(`${this.apiUrl}/userRating/${username}/${bookId}`));
      return response || null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async searchBooksByName(name: string): Promise<Book[]> {
    const username: string | null = this.authService.getName();
    if (!username) {
      return [];
    }

    try {
      // Convertir l'observable en Promise et attendre la réponse
      const response = await firstValueFrom(this.http.get<BookResponse[]>(`${this.apiUrl}/title/${username}/${name}`));

      // Utiliser Promise.all pour attendre que toutes les opérations asynchrones soient terminées
      const booksListResponse = await Promise.all(
        response.map(async (bookRep) => {
          const newBook = await this.externApi.searchByWorkId(bookRep.apiId);
          const ratingInfo = await this.getRating(bookRep.apiId);

          if (!newBook || !ratingInfo) {
            return null; // Ignorer les livres non trouvés ou sans rating
          }

          newBook.userInfo = new UserInfo(bookRep.note, bookRep.state, bookRep.date);
          newBook.ratingInfo = ratingInfo;
          return newBook;
        })
      );

      // Filtrer les valeurs null et retourner la liste des livres
      return booksListResponse.filter((book): book is Book => book !== null);
    } catch (err) {
      console.error(err);
      return [];
    }
  }



  async searchByAuthor(name: string): Promise<Book[]> {
    const username: string | null = this.authService.getName();
    if (!username) {
      return [];
    }

    try {
      // Convertir l'observable en Promise et attendre la réponse
      const response = await firstValueFrom(this.http.get<BookResponse[]>(`${this.apiUrl}/author/${username}/${name}`));

      // Utiliser Promise.all pour attendre que toutes les opérations asynchrones soient terminées
      const booksListResponse = await Promise.all(
        response.map(async (bookRep) => {
          const newBook = await this.externApi.searchByWorkId(bookRep.apiId);

          if (!newBook) {
            return null; // Ignorer les livres non trouvés
          }

          newBook.userInfo = new UserInfo(bookRep.note, bookRep.state, bookRep.date);
          return newBook;
        })
      );

      // Filtrer les valeurs null et retourner la liste des livres
      return booksListResponse.filter((book): book is Book => book !== null);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

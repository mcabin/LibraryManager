import { Component, HostListener } from '@angular/core';
import { Book } from '../../../entities/book.entity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookCardComponent } from "../book-card/book-card.component";
import { ExternalBookService } from '../../../services/api/external-book.service';
import {  ActivatedRoute } from '@angular/router';
import { SearchType } from '../../../entities/misc.entiy';
import { LoadingPageComponent } from "../../loading-page/loading-page.component";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent, LoadingPageComponent],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  booksList: Book[] = [];
  paginatedBooks: Book[] = [];
  currentPage: number = 1; // Initialisé à 1
  pageSize: number = 9; // Valeur par défaut
  nbPages: number = 0;
  pages: number[] = [];
  isLoaded: boolean = false; // Indique si les données sont prêtes

  constructor(private apiGoogleService:ExternalBookService,private route:ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    // Calculer la taille des cartes selon la taille de l'écran

    this.route.queryParamMap.subscribe(async params => {
      const query = params.get('q')||'';
      const type=params.get('type') ||'';
      this.isLoaded=false;
      if(type===SearchType.TITLE){
        this.booksList = await this.apiGoogleService.searchByTitle(query);
        this.calculatePageSize();
        this.updatePagination();
        this.isLoaded=true;
      }
      else if(type===SearchType.AUTHOR){
        this.booksList = await this.apiGoogleService.searchByAuthor(query);
        this.calculatePageSize();
        this.updatePagination();
        this.isLoaded=true;
      }
    });

    
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBooks = this.booksList.slice(startIndex, endIndex);
    this.pages = Array.from({ length: this.nbPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.nbPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  calculatePageSize(): void {
    if (typeof window === 'undefined') { 
           return;
    }
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1200) {
      this.pageSize = 9; // Grand écran
    } else if (screenWidth >= 992) {
      this.pageSize = 6; // Écran moyen
    } else if (screenWidth >= 768) {
      this.pageSize = 3; // Tablettes
    } else {
      this.pageSize = 2; // Petit écran ou téléphone
    }
    this.nbPages = Math.ceil(this.booksList.length / this.pageSize);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    const oldPageSize = this.pageSize;

    // Recalculer la taille de la page
    this.calculatePageSize();

    // Si la taille de la page a changé, recalculer la pagination
    if (this.pageSize !== oldPageSize) {
      this.currentPage = 1; // Réinitialiser à la première page
      this.updatePagination();
    }
  }
}

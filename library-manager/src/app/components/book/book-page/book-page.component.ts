import { Component } from '@angular/core';
import { Book, BookReadState, UserInfo } from '../../../entities/book.entity';
import { ExternalBookService } from '../../../services/api/external-book.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingPageComponent } from "../../loading-page/loading-page.component";
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { BookService } from '../../../services/api/book.service';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../../../services/api/authentification.service';
import { StarRatingComponent } from "../../star-rating/star-rating.component";
import { userInfo } from 'os';
import { IconButtonComponent } from "../../icon-button/icon-button.component";
import { stat } from 'fs';

@Component({
  selector: 'app-book-page',
  standalone: true,
  imports: [LoadingPageComponent, NgTemplateOutlet, CommonModule, FormsModule, StarRatingComponent, IconButtonComponent],
  templateUrl: './book-page.component.html',
  styleUrl: './book-page.component.css'
})
export class BookPageComponent {
  constructor(private externalBookService: ExternalBookService, private route: ActivatedRoute, private bookService: BookService, private authService: AuthentificationService) {

  }
  public book!: Book;
  public loaded: boolean = false;
  public currentState: string = "";
  get isConnected(): boolean|null {
    return this.authService.isLogged();
  }

  get rating(): number {
    if (this.book.userInfo) {
      return this.book.userInfo.rating;
    }
    return 0;
  }
  async ngOnInit() {
    this.loaded = false;
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const tmpBook = await this.externalBookService.searchByWorkId(id);
      if (!tmpBook) {
        //error
        return;
      }
      this.book = tmpBook;
      const rating = await this.bookService.getRating(tmpBook.apiId);
      const userRating = await this.bookService.getUserRating(tmpBook.apiId);
      if (rating) {
        this.book.ratingInfo = rating;
      }
      if (userRating) {
        this.book.userInfo = userRating;
        this.currentState=this.bookReadStateToString(this.book.userInfo.readState);
      }
      this.loaded = true;

    }
  }

  private stringToBookReadState(stringState: string):BookReadState {
    switch (stringState) {
      case "finish":
        return BookReadState.FINISHED
      case "reading":
        return BookReadState.ONGOING;
      case "onList":
        return BookReadState.READLIST;
      default:
        return BookReadState.NOTHING;
    }
  }

  private bookReadStateToString(state: BookReadState): string {
    switch (state) {
      case BookReadState.FINISHED.valueOf():
        return "finish";
      case BookReadState.ONGOING:
        return "reading";
      case BookReadState.READLIST:
        return "onList";
      case BookReadState.NOTHING:
      default:
        return ""; // ou une autre valeur par défaut selon vos besoins
    }
  }

  onStateChange(state: string) {
    this.currentState = state;
    if (this.authService.isLogged()) {
      let modifiedBook = this.book;
      modifiedBook.userInfo = new UserInfo(modifiedBook.userInfo ? modifiedBook.userInfo.rating:0, this.stringToBookReadState(state), new Date());
      this.bookService.createBook(modifiedBook)
    }
  }


  onRatingSelected(rating: number): void {
    if (this.authService.isLogged()) {
      let modifiedBook = this.book;
      modifiedBook.userInfo = new UserInfo(rating, this.stringToBookReadState(this.currentState), new Date());
      this.bookService.createBook(modifiedBook)
    }

  }

}

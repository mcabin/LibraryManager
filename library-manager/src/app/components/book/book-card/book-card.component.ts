import { Component, Input } from '@angular/core';
import { Book } from '../../../entities/book.entity';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() book:Book=new Book("Livre test",'',["Jhon Test"],"ID",{smallCover:"",cover:""},"",2000,10);

}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Output() ratingSelected = new EventEmitter<number>(); // Émet la note sélectionnée
  @Input() currentRating:number=0;
  // @Input() editable:boolean=true;
  hoveredRating = 0; // Note survolée

  // Méthode pour sélectionner une note
  selectRating(rating: number): void {
    this.currentRating = rating;
    this.ratingSelected.emit(rating); // Émet la note sélectionnée
  }

  // Méthode pour survoler une note
  hoverRating(rating: number): void {
    this.hoveredRating = rating;
  }

  // Méthode pour quitter le survol
  resetHover(): void {
    this.hoveredRating = 0;
  }
}

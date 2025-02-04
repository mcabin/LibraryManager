import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  Router } from '@angular/router';
import { AuthentificationService } from '../../services/api/authentification.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  public searchInput:string='';
  public searchType:string='title';
 constructor(private router:Router, private authService:AuthentificationService){
  }
  searchBook() {
    // Encode correctement le texte de recherche
    const searchText = this.searchInput.trim(); // Supprime les espaces inutiles
    const searchType = this.searchType;
    if(searchText.length>0){
      this.router.navigate(['/search'], {
        queryParams: {
          q: searchText,
          type: searchType
        }
      });
    }
    // Utilise Router.navigate pour gérer automatiquement les queryParams
  }

  get isConnected(){
    return this.authService.isLogged();
    }
}

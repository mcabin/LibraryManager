import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthentificationService } from './services/api/authentification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService:AuthentificationService){}
  

  ngOnInit():void{
    this.authService.checkToken();
    
  }
  
  get isConnected():boolean|null{
    return this.authService.isLogged();
  }
  public goToLogin(){
    this.authService.redirectToLogin();
  }

  get userName():string{
    const name:string |null=this.authService.getName();
    if(name)
      return name ;
    return '';
  }
  
  title = 'library-manager';
  public logOut(){
    this.authService.logout();
  }
}

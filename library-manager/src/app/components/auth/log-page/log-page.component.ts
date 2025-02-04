import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../../../services/api/authentification.service';
import { LoginRequest } from '../../../entities/auth.entity';
import { InputEntity } from '../../../entities/input.entity';

@Component({
  selector: 'app-log-page',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './log-page.component.html',
  styleUrl: './log-page.component.css'
})
export class LogPageComponent {
  usernameInput:InputEntity=new InputEntity('',false,'');
  passwordInput:InputEntity=new InputEntity('',false,'');
  constructor(private authService: AuthentificationService) {}

  async login(){
    if(this.usernameInput.checkIfHasContent() && this.passwordInput.checkIfHasContent()){
      const credential:LoginRequest={username:this.usernameInput.content,password:this.passwordInput.content};
      const response:boolean=await this.authService.login(credential);
      if(!response){
        this.usernameInput.setError("Mot de passe ou utilisateur invalide!");
        this.passwordInput.setError("Mot de passe ou utilisateur invalide!")
      }   
    }
    
  }

}

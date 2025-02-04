import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../../../services/api/authentification.service';
import { AuthError, AuthErrorType, RegisterRequest } from '../../../entities/auth.entity';
import { InputEntity } from '../../../entities/input.entity';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  usernameInput: InputEntity = new InputEntity();
  emailInput: InputEntity = new InputEntity();
  passwordInput: InputEntity = new InputEntity();
  confirmPasswordInput: InputEntity = new InputEntity();

  constructor(private authService: AuthentificationService) { }

  async register() {
    this.usernameInput.resetError();
    this.emailInput.resetError();
    this.confirmPasswordInput.resetError();
    this.passwordInput.resetError();
    if (this.usernameInput.checkIfHasContent() && this.emailInput.checkIfHasContent() && this.passwordInput.checkIfHasContent() && this.confirmPasswordInput.checkIfHasContent()) {
      if (this.passwordInput.content == this.confirmPasswordInput.content) {
        const credential: RegisterRequest = {
          username: this.usernameInput.content,
          password: this.passwordInput.content,
          email: this.emailInput.content
        }
        console.log(credential)
        try {
          await this.authService.register(credential);

        } catch (error:unknown) {
          if(error instanceof AuthError){
            console.log(error)
            if(error.type==AuthErrorType.EMAIL){
              this.emailInput.setError(error.msg);
            }
            else if(error.type==AuthErrorType.USER){
              this.usernameInput.setError(error.msg);
            }
          }
          else{
            console.error(error);
          }
        }
        
      }
      else {
        this.confirmPasswordInput.setError("Doit être identique au mot de passe!");
      }

    }


  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthError, AuthResponse, LoginRequest, RegisterRequest } from '../../entities/auth.entity';
import { API_LINK, JWT_TOKEN_KEY } from '../../app.constant';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private apiUrl = `${API_LINK}/auth`;


  private redirectUrl: string | null = null;

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: any) { }

  private refreshTokenTimeout!: NodeJS.Timeout;

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string  {
    if(this.redirectUrl)
      return this.redirectUrl;
    return '';
  }

  redirectToLogin() {
    this.setRedirectUrl(window.location.pathname); // Stocke l'URL actuelle
    this.router.navigate(['/login']); // Redirige vers la page de login
  }

  // Save the token in local storage
  private saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(JWT_TOKEN_KEY, token);
    }
  }

  public getToken(): string | null {
    if(isPlatformBrowser(this.platformId))
      return localStorage.getItem(JWT_TOKEN_KEY);
    return null;
  }

  public logout(): void {
    if(isPlatformBrowser(this.platformId)){
      localStorage.removeItem(JWT_TOKEN_KEY);
    }
  }

  public isLogged(): boolean|null {
    if(isPlatformBrowser(this.platformId) && localStorage){
      return this.getToken() != null;
    }
    return null;
  }

  private getTokenExpiration(): number {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const expirationDate: number = decodedToken.exp;
      return expirationDate * 1000;
    }
    return 0;
  }

  public getName(): string | null {
    const jwtToken = this.getToken();
    if (jwtToken) {
      const jwt: any = jwtDecode(jwtToken);
      return jwt.sub || null;
    }
    return null;
  }

  public getUserId(): number | null {
    const jwtToken = this.getToken();
    if (jwtToken) {
      const jwt: any = jwtDecode(jwtToken);
      return jwt.id || null;
    }
    return null;
  }

  public getUserEmail(): string | null {
    const jwtToken = this.getToken();
    if (jwtToken) {
      const jwt: any = jwtDecode(jwtToken);
      return jwt.email || null;
    }
    return null;
  }

  // Check token validity
  public async checkToken(): Promise<void> {
    if (!this.tokenIsValid()) {
      this.logout();
    }
    else
      this.scheduleRefreshToken();
  }

  private tokenIsValid(): boolean {
    const token = this.getToken();
    if (token) {
      return this.getTokenExpiration() > Date.now();
    }
    return false;
  }

  private refreshToken(): void {
    const token = this.getToken();
    if (!token) return;

    this.http.post<{ token: string }>(`${this.apiUrl}/refreshToken`, token ).subscribe({
      next: (response) => {
        this.saveToken(response.token);
        this.scheduleRefreshToken();
        console.log("Token has been refreshed");
      },
      error: (err) => {
        this.logout();
        console.error("Failed to refresh token:", err);
      }
    });
  }

  private scheduleRefreshToken(): void {
    const token = this.getToken();
    if (!token) return;
    const timeout: number = this.getTokenExpiration() - Date.now() - (60 * 1000);
    if (timeout > 0) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = setTimeout(() => {
        this.refreshToken();
      }, timeout);
    }
  }

  // Login
  public async login(credential: LoginRequest): Promise<boolean> {
    try {
      const response: AuthResponse = await firstValueFrom(this.http.post<AuthResponse>(`${this.apiUrl}/login`, credential));
      this.saveToken(response.token);
      console.log("Connexion réussie!");
      this.router.navigateByUrl(this.getRedirectUrl());
      this.scheduleRefreshToken();
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      throw new AuthError("Login failed");
    }
  }

  // Register
  public async register(credential: RegisterRequest): Promise<boolean> {
    try {
      const response: AuthResponse = await firstValueFrom(this.http.post<AuthResponse>(`${this.apiUrl}/register`, credential));
      this.saveToken(response.token);
      console.log("Inscription réussie!");
      this.router.navigateByUrl(this.getRedirectUrl());
      return true;
    } catch (err: any) {
      console.error("Registration failed:", err);
      throw new AuthError(err.error.errorMsg || "Registration failed");
    }
  }
}
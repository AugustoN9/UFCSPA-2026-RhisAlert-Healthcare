import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserProfile } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly STORAGE_KEY = 'rhis_alert_user';
  
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private userSignal = signal<UserProfile | null>(null);
  readonly currentUser = computed(() => this.userSignal());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  // Registo: Envia os dados para o MongoDB Atlas
  register(profile: UserProfile): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, profile);
  }

  // Login: Valida as credenciais no backend
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response && response.user) {
          this.saveUser(response.user);
        }
      })
    );
  }

  private saveUser(user: UserProfile): void {
    this.userSignal.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.userSignal.set(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar sessão:", e);
      }
    }
  }

  logout(): void {
    this.userSignal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
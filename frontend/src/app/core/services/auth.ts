import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core'; // Adicione inject e PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Adicione isPlatformBrowser
import { UserProfile } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'rhis_alert_data';
  private platformId = inject(PLATFORM_ID); // Injeta o ID da plataforma (servidor ou navegador)

  private userSignal = signal<UserProfile | null>(null);
  readonly currentUser = computed(() => this.userSignal());

  constructor() {
    // Só tenta carregar se estivermos rodando no NAVEGADOR
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  login(email: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const user: UserProfile = JSON.parse(savedData);
        if (user.email === email) {
          this.userSignal.set(user);
          return true;
        }
      }
    }
    return false;
  }

  register(profile: UserProfile): void {
    const data = { ...profile, registrationDate: new Date() };
    
    // Proteção para o salvamento
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
    
    this.userSignal.set(data);
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.userSignal.set(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao ler dados de saúde:", e);
      }
    }
  }
}
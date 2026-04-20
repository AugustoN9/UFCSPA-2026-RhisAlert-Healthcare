import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private authService = inject(AuthService);
  
  // Pegando os dados do usuário via Signal
  user = this.authService.currentUser;

  // Dados mockados (depois integraremos com API de clima)
  weather = signal({ temp: 18, humidity: 35, airQuality: 'Moderada' });

  // Cálculo de Risco Respiratório baseado em variáveis biomédicas
  // Risco = (100 - Umidade) * Fator de Sensibilidade
  riskScore = computed(() => {
    const h = this.weather().humidity;
    return Math.round((100 - h) * 0.8); 
  });

  getRiskLevel() {
    const score = this.riskScore();
    if (score < 30) return { label: 'Baixo', class: 'bg-success' };
    if (score < 60) return { label: 'Médio', class: 'bg-warning text-dark' };
    return { label: 'Alto', class: 'bg-danger' };
  }
}
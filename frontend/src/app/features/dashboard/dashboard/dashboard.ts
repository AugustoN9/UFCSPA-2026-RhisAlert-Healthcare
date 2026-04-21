import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';
import { WeatherService } from '../../../core/services/weather'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private weatherService = inject(WeatherService);
  
  user = this.authService.currentUser;
  weather = this.weatherService.weatherSignal;

  ngOnInit() {
    this.weatherService.getWeather().subscribe();
  }

  // Define a cor hexadecimal para o preenchimento CSS
  getGaugeColor(): string {
    const score = this.weather()?.riskScore || 0;
    if (score >= 75) return '#dc3545'; // Vermelho (Crítico)
    if (score >= 40) return '#ffc107'; // Amarelo (Moderado)
    return '#198754'; // Verde (Baixo)
  }

  // Mapeia classes de texto do Bootstrap
  getRiskColorClass(): string {
    const score = this.weather()?.riskScore || 0;
    if (score >= 75) return 'text-danger';
    if (score >= 40) return 'text-warning';
    return 'text-success';
  }

  getRiskStatusMessage(): string {
    const score = this.weather()?.riskScore || 0;
    if (score >= 75) return 'Cuidado Extremo!';
    if (score >= 40) return 'Atenção Necessária';
    return 'Dia tranquilo!';
  }

  getRiskStyles() {
    const label = this.weather()?.riskLabel || 'Baixo';
    switch (label) {
      case 'Muito Alto': return { label: 'Crítico', class: 'bg-danger text-white' };
      case 'Médio': return { label: 'Moderado', class: 'bg-warning text-dark' };
      default: return { label: 'Seguro', class: 'bg-success text-white' };
    }
  }

  // Função de simulação para validar o alerta visual
  simularAlertaCritico() {
    const mockData = {
      city: 'Porto Alegre (Alerta)',
      temp: '34.2',
      feels_like: '37.0',
      humidity: 20,
      windSpeed: 1.5,
      description: 'Condições Críticas',
      aqi: 5,
      pm25: 88,
      pollutants: { co: 1300, no: 12, no2: 85, o3: 200, so2: 55, pm2_5: 88, pm10: 115, nh3: 8 },
      riskScore: 95,
      riskLabel: 'Muito Alto',
      bioTips: [
        'Evite atividades ao ar livre.',
        'Mantenha ambientes internos úmidos.',
        'Realize lavagem nasal com soro.'
      ],
      updatedAt: new Date()
    };
    this.weatherService.weatherSignal.set(mockData as any);
  }
}
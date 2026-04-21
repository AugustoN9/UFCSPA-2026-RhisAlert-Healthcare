import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// 1. Criamos um tipo específico para os poluentes
export interface WeatherPollutants {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

// 2. Atualizamos a interface principal
export interface WeatherData {
  city: string;
  temp: string | number;
  feels_like: string | number;
  humidity: number;
  windSpeed: number;
  description: string;
  aqi: number;
  pm25: number;
  pollutants: WeatherPollutants;
  riskScore: number; // Adicionado para o Riscômetro (0-100)
  riskLabel: string; // Adicionado para o texto de Status
  bioTips: string[]; // Alterado para Array conforme o protótipo
  updatedAt: string | Date;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/weather';

  // Sinal para armazenar o clima e ser consumido por qualquer componente
  weatherSignal = signal<WeatherData | null>(null);

  getWeather(): Observable<WeatherData> {
    return this.http
      .get<WeatherData>(this.API_URL)
      .pipe(tap((data) => this.weatherSignal.set(data)));
  }
}

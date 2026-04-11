import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.weatherApiKey;
  private apiUrl = 'https://api.weatherapi.com/v1/current.json';
  private backendUrl = `${environment.apiUrl}/api/weather`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getWeather(city: string): Observable<any> {
    const url = `${this.backendUrl}/search/${city}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getWeatherbyCord(lat: string, lon: string): Observable<any> {
    // Usando a API weatherapi.com diretamente para coordenadas
    const url = `${this.apiUrl}?key=${this.apiKey}&q=${lat},${lon}&lang=pt`;
    return this.http.get(url);
  }

  getForecast(city: string): Observable<any> {
    const url = `${this.backendUrl}/forecast/${city}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getWeatherDetails(city: string): Observable<any> {
    const url = `${this.backendUrl}/details/${city}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getAlerts(city: string): Observable<any> {
    const url = `${this.backendUrl}/alerts/${city}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
}


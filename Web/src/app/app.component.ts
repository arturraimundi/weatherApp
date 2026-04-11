import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './weather.service';
import { LocationService } from './locationService';
import { AuthService } from './auth.service';
import { LoginComponent } from './login.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  city: string = '';
  weatherData: any = null;
  weatherDetails: any = null;
  forecast: any = null;
  alerts: any = null;
  error: string = '';
  userLocation: any;
  currentUser: any = null;
  isLoading: boolean = false;
  activeTab: string = 'current';

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  async ngOnInit() {
    if (this.currentUser) {
      this.userLocation = await this.locationService.getUserLocation();
      this.weatherbyLocation();
    }
  }

  searchWeather() {
    if (!this.city.trim()) {
      this.error = 'Digite uma cidade';
      return;
    }

    this.isLoading = true;
    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.getWeatherDetails();
        this.getForecast();
        this.getAlerts();
        this.error = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Cidade não encontrada';
        this.weatherData = null;
        this.isLoading = false;
      }
    });
  }

  weatherbyLocation() {
    if (!this.userLocation) return;

    this.isLoading = true;
    this.weatherService.getWeatherbyCord(
      this.userLocation.lat.toString(),
      this.userLocation.long.toString()
    ).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.city = data.location.name;
        this.getWeatherDetails();
        this.getForecast();
        this.getAlerts();
        this.error = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Não foi possível obter dados da sua localização';
        this.weatherData = null;
        this.isLoading = false;
      }
    });
  }

  getWeatherDetails() {
    if (!this.city) return;
    this.weatherService.getWeatherDetails(this.city).subscribe({
      next: (data) => {
        this.weatherDetails = data;
      },
      error: (err) => {
        console.error('Erro ao obter detalhes:', err);
      }
    });
  }

  getForecast() {
    if (!this.city) return;
    this.weatherService.getForecast(this.city).subscribe({
      next: (data) => {
        this.forecast = data;
      },
      error: (err) => {
        console.error('Erro ao obter previsão:', err);
      }
    });
  }

  getAlerts() {
    if (!this.city) return;
    this.weatherService.getAlerts(this.city).subscribe({
      next: (data) => {
        this.alerts = data;
      },
      error: (err) => {
        console.error('Erro ao obter alertas:', err);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.weatherData = null;
    this.weatherDetails = null;
    this.forecast = null;
    this.alerts = null;
    this.city = '';
    this.currentUser = null;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}


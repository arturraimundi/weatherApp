  import { Component, OnInit} from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { WeatherService } from './weather.service';
  import { LocationService } from './locationService';
  import { trigger, transition, style, animate } from '@angular/animations';

  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, FormsModule],
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

  export class AppComponent implements OnInit{

    city: string = '';
    weatherData: any = null;
    error: string = '';
    userLocation: any;

    constructor(private weatherService: WeatherService, private locationService: LocationService) {}
    async ngOnInit() {
      this.userLocation = await this.locationService.getUserLocation();
      this.weatherbyLocation();
      console.log(this.userLocation.lat);
      console.log(this.userLocation.long);

    }
    searchWeather() {
      
      this.weatherService.getWeather(this.city).subscribe({
        next: (data) => {
          this.weatherData = data;
          this.error = '';
        },
        error: (err) => {
          this.error = 'City not found ;(.';
          this.weatherData = null;
        }
      });

    }
    weatherbyLocation() {
      this.weatherService.getWeatherbyCord(this.userLocation.lat.toString(), this.userLocation.long.toString()).subscribe({
        next: (data) => {
          this.weatherData = data;
          this.error = '';
          console.log(this.userLocation.lat);
          console.log(this.userLocation.long);
          console.log(this.weatherData.city);
        },
        error: (err) => {
          this.error = 'City not found ;(.';
          this.weatherData = null;
        }
      });

    }

    
  }

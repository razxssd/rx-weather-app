import { Component } from '@angular/core';
import {WeatherService} from './weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchInput = '';

  constructor(
    private weatherService: WeatherService
  ) { }

  onSubmit(): void {
    this.weatherService.getWeatherByCity(this.searchInput);
    console.log('searchInput: ', this.searchInput);
    console.log('weatherService.weather: ', this.weatherService.weather);
  }
}

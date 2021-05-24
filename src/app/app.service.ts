import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import {IGetWeatherService} from './core/interfaces';

@Injectable()
export class WeatherService {

  weather: IGetWeatherService[] = [];
  loading$ = new BehaviorSubject(false);
  notFound = false;

  constructor(
    private http: HttpClient,
  ) { }

  getWeatherByCityService$() {
    return this.http.
    get<IGetWeatherService[]>(`${environment.openWeather_URL}`);
  }

  getWeatherByCity() {
    this.getWeatherByCityService$().
    subscribe(weatherResp => {
      this.loading$.next(false);
      this.weather = weatherResp;

      if (weatherResp.length > 0) {
        //
      } else {
        this.notFound = true;
      }
    });
  }

}

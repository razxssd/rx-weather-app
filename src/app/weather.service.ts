import {environment} from 'src/environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Daily, IGetWeatherForManyDaysService, IGetWeatherService, IWeatherObjProps} from './core/interfaces';

@Injectable()
export class WeatherService {

  weather: IWeatherObjProps = {};
  loading$ = new BehaviorSubject(false);
  notFound = false;

  constructor(
    private http: HttpClient,
  ) {
  }

  getWeatherByCityService$(city: string) {
    return this.http.get<IGetWeatherService>(`${environment.openWeather_URL}/weather?q=${city}&units=metric&appid=${environment.openWeather_APP_ID}`);
  }

  getWeatherForNextDaysByLatLonService$(lat: number, lon: number) {
    return this.http.get<IGetWeatherForManyDaysService>(`${environment.openWeather_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${environment.openWeather_APP_ID}&units=metric`);
  }

  getWeatherByCity(city: string) {
    this.getWeatherByCityService$(city).subscribe(weatherResp => {
      console.log('weatherResp: ', weatherResp);
      this.weather = this.composePrincipalCardObj(weatherResp);

      this.getWeatherForNextDaysByLatLonService$(weatherResp.coord.lat, weatherResp.coord.lon).subscribe(weatherForNextDaysResp => {
        this.loading$.next(false);
        console.log('weatherForNextDaysResp: ', weatherForNextDaysResp);
        const weatherForNextDaysDaily = [...weatherForNextDaysResp.daily];
        if (weatherForNextDaysResp.daily.length > 1) {
          weatherForNextDaysDaily.shift();
        }

        this.weather = this.composeSecondaryCardObj(weatherForNextDaysDaily);
        if (weatherResp.name) {
          //
        } else {
          this.notFound = true;
        }

      });
    });
  }

  composePrincipalCardObj(weatherServiceResp: IGetWeatherService): IWeatherObjProps {
    return {
      principalCard: {
        city: weatherServiceResp.name,
        temp: weatherServiceResp.main && Math.round(weatherServiceResp.main.temp),
        min_temp: weatherServiceResp.main && Math.round(weatherServiceResp.main.temp_min),
        max_temp: weatherServiceResp.main && Math.round(weatherServiceResp.main.temp_max),
        day_name: this.getNameOfTheDay(new Date()),
        date_formatted: new Date().toDateString()
      }
    };
  }

  composeSecondaryCardObj(weatherForNextDaysRespDaily: Daily[]): IWeatherObjProps {
    return {
      principalCard: {...this.weather.principalCard},
      secondaryCard: weatherForNextDaysRespDaily.map((day: Daily) => {
        return {
          day: this.getNameOfTheDay(new Date(day.dt * 1000)),
          max_temp: Math.round(day.temp.max),
          min_temp: Math.round(day.temp.min),
          day_type: 'string'
        };
      })
    };
  }

  getNameOfTheDay(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }
}

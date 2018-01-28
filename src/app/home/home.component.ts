import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ForecastModel } from '../shared/forecast.model';
import * as moment from 'moment-timezone';
import * as request from 'request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public isLoading: boolean = false;
  public isResultsHidden: boolean = false;
  public searchQuery: string = '';
  public searchLatitude: number = 37.384856;
  public searchLongitude: number = -121.992552;


  public currentEarthLocation: string;
  public currentEarthConditions: ForecastModel;
  public currentGameConditions: ForecastModel;
  public upcomingEarthConditions: ForecastModel[];
  public upcomingGameConditions: ForecastModel[];

  constructor(public snackBar: MatSnackBar) {
    this.isLoading = true;
    this.isResultsHidden = true;
    this.currentEarthLocation = '';
    this.currentEarthConditions = this.currentGameConditions = new ForecastModel();

    this.setRoughLocation();
  }

  ngOnInit() { }

  private setRoughLocation() {
    request('http://localhost:3000/ip_location', (error, response, body) => {
      if (error) {
        console.warn('Failed to get rough location: ', error);
      }
      else {
        let location: string = '';
        let results: any = JSON.parse(body);
        console.log('Got rough location: ', results);
        if (results.city) {
          location += results.city;
          location += ', ' + results.region_code;
          location += ', ' + results.country_code;
        }

        if (location) {
          this.searchQuery = location;
          this.currentEarthLocation = location;
          this.updateForecasts(false);
        }
      }
    });
  }

  private setPreciseLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(`Got precise location: ${position.coords.latitude}, ${position.coords.longitude}`);
      this.searchLatitude = position.coords.latitude;
      this.searchLongitude = position.coords.longitude;
      this.updateForecasts(true);
    }, error => {
      console.warn('Failed to get precise location. Error code: ' + error.code);
      let message = 'Failed to access your precise location.';
      switch (error.code) {
        case 1:
          message = 'We can\'t get your precise location without your permission.';
          break;
        case 2:
          message = 'Your device can\'t get your precise location right now.';
          break;
        case 3:
          message = 'Click the button to allow access to location.';
          break;
      }
      this.snackBar.open(message, 'Dismiss', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 5000
      });
    }, {
      timeout: 10 * 1000,
      maximumAge: 10 * 1000,
      enableHighAccuracy: true
    });
  }

  private updateForecasts(usePrecise: boolean) {
    this.isLoading = true;
    let location: any = {
      searchQuery: this.searchQuery
    }
    if (usePrecise) {
      location = {
        lat: this.searchLatitude,
        long: this.searchLongitude
      }
    }
    request({
        uri: 'http://localhost:3000/weather',
        qs: location
      }, (error, response, body) => {
      if (error || response.statusCode < 200 || response.statusCode > 299) {
        console.warn('API error', error ? error : JSON.parse(body));
        let errorBody = body ? JSON.parse(body) : null;
        let errorMessage = 'The weather service is currently experiencing problems. Please try again later.';
        if (errorBody && errorBody.errorCode == 'BAD_SEARCH')
          errorMessage = 'The location is not recognized by AccuWeather. Try a different search term.';
        this.snackBar.open(errorMessage, 'Dismiss', {
          verticalPosition: 'top',
          horizontalPosition: 'center',
          duration: 5000
        });
      }
      else {
        let results: any = JSON.parse(body);
        let forecasts = results.forecast;
        console.log('Got results: ', results);
        let timezone: string = results.location.TimeZone.Name;
        this.currentEarthConditions = ForecastModel.importFromAccuweather(timezone, forecasts[0]);
        this.upcomingEarthConditions = [
          ForecastModel.importFromAccuweather(timezone, forecasts[1]),
          ForecastModel.importFromAccuweather(timezone, forecasts[2]),
          ForecastModel.importFromAccuweather(timezone, forecasts[3]),
          ForecastModel.importFromAccuweather(timezone, forecasts[4]),
          ForecastModel.importFromAccuweather(timezone, forecasts[5])
        ];
        this.currentGameConditions = this.currentEarthConditions;
        this.upcomingGameConditions = this.upcomingEarthConditions;
        this.currentEarthLocation = `${results.location.LocalizedName}, ${results.location.AdministrativeArea.ID}, ${results.location.Country.ID}`;
        this.isLoading = false;
      }
    });
  }

}

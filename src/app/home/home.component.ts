import { Component, OnInit } from '@angular/core';
import { ForecastModel } from '../shared/forecast.model';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public currentEarthLocation: string;
  public currentEarthConditions: ForecastModel;
  public currentGameConditions: ForecastModel;
  public upcomingEarthConditions: ForecastModel[];
  public upcomingGameConditions: ForecastModel[];

  constructor() {
    this.currentEarthLocation = "Matthews, NC, USA";
    this.currentEarthConditions = new ForecastModel(new Date(), 32, "Partly Cloudy", 34, "F", 3, "MPH", "NNW");
    this.upcomingEarthConditions = [
      new ForecastModel(moment(new Date()).add(1, 'hour'), 31, "Partly Cloudy", 35, "F", 3, "MPH", "NNW"),
      new ForecastModel(moment(new Date()).add(2, 'hour'), 33, "Partly Cloudy", 35, "F", 0, "MPH", "-"),
      new ForecastModel(moment(new Date()).add(3, 'hour'), 36, "Partly Cloudy", 35, "F", 1, "MPH", "NW"),
      new ForecastModel(moment(new Date()).add(4, 'hour'), 34, "Partly Cloudy", 35, "F", 6, "MPH", "S"),
      new ForecastModel(moment(new Date()).add(5, 'hour'), 32, "Partly Cloudy", 35, "F", 4, "MPH", "SE"),
    ]

    this.currentGameConditions = this.currentEarthConditions;
    this.upcomingGameConditions = this.upcomingEarthConditions;
  }

  ngOnInit() {
  }

}

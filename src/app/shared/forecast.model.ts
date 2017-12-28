import * as moment from 'moment-timezone';

export class ForecastModel {
  public forecastHour: Date;
  public conditionIconCode: number;
  public conditionTitle: string;
  public temperature: number;
  public temperatureUnit: string;
  public windSpeed: number;
  public windSpeedUnit: string;
  public windDirection: string;

  constructor(forecastHour: Date, conditionIconCode: number, conditionTitle: string, temperature: number, temperatureUnit: string, windSpeed: number, windSpeedUnit: string, windDirection: string) {
    this.forecastHour = forecastHour;
    this.conditionIconCode = conditionIconCode;
    this.conditionTitle = conditionTitle;
    this.temperature = temperature;
    this.temperatureUnit = temperatureUnit;
    this.windSpeed = windSpeed;
    this.windSpeedUnit = windSpeedUnit;
    this.windDirection = windDirection;
  }

  get forecastHourLong(): string {
    return moment.tz(this.forecastHour, moment.tz.guess()).format('h:mm A z');
  }

  get forecastHourShort(): string {
    return moment.tz(this.forecastHour, moment.tz.guess()).format('h A');
  }

  get gameConditionIconName(): string {
    switch (this.conditionIconCode) {
      case 31:
        return "Windy"
      case 32:
        return "Partly_Cloudy_Day";
      case 33:
        return "Clear_Day";
      case 34:
        return "Rain";
      case 36:
        return "Snow";
      default:
        return "Extreme";
    }
  }
}

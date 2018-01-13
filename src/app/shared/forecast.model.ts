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
  public isDaylight: boolean;

  //constructor();
  constructor(forecastHour?: Date, conditionIconCode?: number, conditionTitle?: string, temperature?: number, temperatureUnit?: string, windSpeed?: number, windSpeedUnit?: string, windDirection?: string, isDaylight?: boolean) {
    this.forecastHour = forecastHour || new Date();
    this.conditionIconCode = conditionIconCode || 15;
    this.conditionTitle = conditionTitle || '-';
    this.temperature = temperature || 0;
    this.temperatureUnit = temperatureUnit || 'F';
    this.windSpeed = windSpeed || 0;
    this.windSpeedUnit = windSpeedUnit || 'MPH';
    this.windDirection = windDirection || 'NA';
    if (isDaylight == null || isDaylight === null || typeof isDaylight === 'undefined')
      this.isDaylight = true;
    else
      this.isDaylight = isDaylight;
  }

  get forecastHourLong(): string {
    return moment.tz(this.forecastHour, moment.tz.guess()).format('h:mm A');
  }

  get forecastHourShort(): string {
    return moment.tz(this.forecastHour, moment.tz.guess()).format('h A');
  }

  get gameConditionIconName(): string {
    let result: string = "";
    switch (this.conditionIconCode) {
      case 33:
      case 38:
        result = "Clear";
        break;
      case 37:
        result = "Cloudy";
        break;
      case 30:
        result = "Foggy";
        break;
      case 32:
        result = "Partly_Cloudy";
        break;
      case 34:
        result = "Rain";
        break;
      case 36:
        result = "Snow";
        break;
      case 31:
        result = "Windy"
        break;
      default:
        result = "Extreme";
    }
    return result + (this.isDaylight ? "_Day" : "_Night");
  }

  get gameConditionTitle(): string {
    let result: string = "";
    switch (this.conditionIconCode) {
      case 33:
      case 38:
        result = "Clear";
        break;
      case 37:
        result = "Cloudy";
        break;
      case 30:
        result = "Foggy";
        break;
      case 32:
        result = "Partly Cloudy";
        break;
      case 34:
        result = "Rain";
        break;
      case 36:
        result = "Snow";
        break;
      case 31:
        result = "Windy"
        break;
      default:
        result = "Extreme";
    }
    return result;
  }

  static importFromAccuweather(source: any): ForecastModel {
    console.log("Parsing forecast: ", source);
    let forecastHour: Date = source.DateTime;
    let conditionTitle: string = source.IconPhrase;
    let temperature: number = source.Temperature.Value;
    let temperatureUnit: string = source.Temperature.Unit;
    let windSpeed: number = source.Wind.Speed.Value;
    let windSpeedUnit: string = source.Wind.Speed.Unit;
    let windDirection: string = source.Wind.Direction.Localized;

    let conditionIconCode: number = 15;

    let baseIconCode: number = source.WeatherIcon;
    let rainProbability: number = source.RainProbability;
    let snowProbabliity: number = source.SnowProbability;
    let cloudCover: number = source.CloudCover;
    let isDaylight: boolean = source.IsDaylight;
    let visibility: number = source.Visibility.Value;
    let visibilityUnit: number = source.Visibility.Unit;

    if (rainProbability > snowProbabliity && rainProbability >= 50) {
      conditionIconCode = 34;
    }
    else if (snowProbabliity > rainProbability && snowProbabliity >= 50) {
      conditionIconCode = 36;
    }
    else if ((windSpeedUnit == 'mi/h' && windSpeed > 10) || windSpeed > 16) { // greater than 10 MPH or 16 KPH
      conditionIconCode = 31;
    }
    else if (baseIconCode == 11) {
      conditionIconCode = 31;
    }
    else if (cloudCover >= 75) {
      conditionIconCode = 37;
    }
    else if (cloudCover >= 50) {
      conditionIconCode = isDaylight ? 32 : 32;
    }
    else {
      conditionIconCode = isDaylight ? 33 : 38;
    }

    return new ForecastModel(forecastHour, conditionIconCode, conditionTitle, temperature, temperatureUnit, windSpeed, windSpeedUnit, windDirection, isDaylight);
  }
}

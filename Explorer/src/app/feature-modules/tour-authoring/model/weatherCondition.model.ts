export interface WeatherCondition {
    minTemperature:number
    maxTemperature:number
    suitableConditions:WeatherConditionType[]
}

export enum WeatherConditionType{
    CLEAR = 0,
    CLOUDS = 1,
    RAIN = 2,
    SNOW = 3,
    MIST = 4
}
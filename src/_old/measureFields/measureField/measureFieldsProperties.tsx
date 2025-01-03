import { Unit, UnitProps } from "js-ballistics";
import { MeasureFormFieldProps } from "./measureField";

export const measureFieldsProps: Record<string, Partial<MeasureFormFieldProps>> = {
    temp: {
        fKey: "cZeroAirTemperature",
        label: "Temperature",
        suffix: UnitProps[Unit.Celsius].symbol,
        icon: "thermometer",
        maxValue: 50,
        minValue: -50,
        fractionDigits: 0,
        value: 15,
    },
    pressure: {
        fKey: "pressure",
        label: "Pressure",
        suffix: UnitProps[Unit.hPa].symbol,
        icon: "gauge",
        maxValue: 1300,
        minValue: 700,
        fractionDigits: 0,
        value: 1000,
    },
    humidity: {
        fKey: "humidity",
        label: "Humidity",
        suffix: "%",
        icon: "water",
        maxValue: 100,
        minValue: 0,
        fractionDigits: 0,
        value: 78,
    },
    windSpeed: {
        fKey: "windSpeed",
        label: "Wind speed",
        suffix: UnitProps[Unit.MPS].symbol,
        icon: "windsock",
        value: 0,
        maxValue: 100,
        minValue: 0,
        fractionDigits: 1,
        step: 0.1
    },
};
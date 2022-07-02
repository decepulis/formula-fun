import type { Drivers, Teams, Keys } from './2022';

export interface OddsRow {
	o1: number;
	o3: number;
	o6: number;
	o10: number;
}
export type OddsTable = Record<Drivers, OddsRow>;

export interface PercentRow {
	p1: number;
	p3: number;
	p6: number;
	p10: number;
	pAvg: number;
}
export type PercentTable = Record<Drivers, PercentRow>;

export interface Adjustment {
	adj1: number;
	adj3: number;
	adj6: number;
	adj10: number;
	adjAvg: number;
}

export interface PriceRow {
	price: number;
	bonus: number;
}

export type PriceTable = Record<Drivers & Teams, PriceRow>;

export type PredictionRow = {
	pricePrediction: number;
};
export type PredictionTable = Record<Drivers & Teams, PredictionRow>;

export interface Play {
	price: number;
	predictionPoints: number;
}
export interface PlaysRow extends Play {
	keys: Keys[];
}
export type PlaysTable = PlaysRow[];

export type Race = {
	name: string;
	odds?: OddsTable;
	results?: Drivers[];
};

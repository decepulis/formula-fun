type Driver =
  | "Hamilton"
  | "Bottas"
  | "Verstappen"
  | "Perez"
  | "Leclerc"
  | "Sainz"
  | "Ricciardo"
  | "Norris"
  | "Stroll"
  | "Vettel"
  | "Alonso"
  | "Ocon"
  | "Gasly"
  | "Tsunoda"
  | "Raikkonnen"
  | "Giovinazzi"
  | "Schumacher"
  | "Mazepin"
  | "Russell"
  | "Latifi";
type Odds = number;
type Percent = number;
type ExpectedPoints = number;

export interface OddsRow {
  o1: Odds;
  o3: Odds;
  o6: Odds;
  o10: Odds;
}
export type OddsTable = Record<Driver, OddsRow>;

export interface PercentRow {
  p1: Percent;
  p3: Percent;
  p6: Percent;
  p10: Percent;
  pAvg: number;
}
export type PercentTable = Record<Driver, PercentRow>;

export interface Adjustment {
  adj1: number;
  adj3: number;
  adj6: number;
  adj10: number;
  adjAvg: number;
}

export interface CostRow {
  cost: number;
  bonus: number;
}

export type CostTable = Record<Driver, CostRow>;

export type PredictionTable = Record<Driver, ExpectedPoints>;

export type EnabledTable = Record<Driver, boolean>;

export interface PointsRow {
  predictionPoints: number;
  costPoints: number;
  oddsPoints: number;
}
export type PointsTable = Record<Driver, PointsRow>;

export interface Play {
  cost: number;
  predictionPoints: number;
  costPoints: number;
  oddsPoints: number;
}

export interface PlaysRow extends Play {
  drivers: Driver[];
}

export type PlaysTable = PlaysRow[];

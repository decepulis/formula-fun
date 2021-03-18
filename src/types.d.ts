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

export interface OddsRow {
  o_1: Odds;
  o_3: Odds;
  o_6: Odds;
  o_10: Odds;
}
export type OddsTable = Record<Driver, OddsRow>;

export interface PercentRow {
  p_1: Percent;
  p_3: Percent;
  p_6: Percent;
  p_10: Percent;
  p_avg: number;
}
export type PercentTable = Record<Driver, PercentRow>;

export interface Adjustment {
  adj_1: number;
  adj_3: number;
  adj_6: number;
  adj_10: number;
  adj_avg: number;
}

export interface CostRow {
  cost: number;
  bonus?: number;
}

export type CostTable = Record<Driver, CostRow>;

export interface Play {
  cost: number;
  points: number;
}
export type PlaysMap = Map<string, Play>;

export interface PlaysRow extends Play {
  drivers: string;
}

export type PlaysTable = PlaysRow[];

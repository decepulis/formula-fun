import type { OddsTable } from "./types";

export const season: { [race: string]: OddsTable } = {
  bahrain: {
    Hamilton: { o1: 175, o3: -300, o6: -500, o10: -800 },
    Bottas: { o1: 900, o3: 120, o6: -300, o10: -600 },
    Verstappen: { o1: 175, o3: -400, o6: -600, o10: -900 },
    Perez: { o1: 1200, o3: 125, o6: -300, o10: -600 },
    Leclerc: { o1: 6600, o3: 1000, o6: 125, o10: -275 },
    Sainz: { o1: 10000, o3: 2200, o6: 225, o10: -200 },
    Ricciardo: { o1: 1600, o3: 250, o6: -225, o10: -500 },
    Norris: { o1: 1600, o3: 250, o6: -225, o10: -500 },
    Stroll: { o1: 15000, o3: 2200, o6: 300, o10: -150 },
    Vettel: { o1: 15000, o3: 2200, o6: 300, o10: -150 },
    Alonso: { o1: 20000, o3: 4000, o6: 600, o10: -110 },
    Ocon: { o1: 20000, o3: 4000, o6: 700, o10: 125 },
    Gasly: { o1: 10000, o3: 1600, o6: 135, o10: -275 },
    Tsunoda: { o1: 10000, o3: 2200, o6: 300, o10: -165 },
    Raikkonnen: { o1: 100000, o3: 10000, o6: 1200, o10: 225 },
    Giovinazzi: { o1: 100000, o3: 10000, o6: 1200, o10: 225 },
    Schumacher: { o1: 300000, o3: 100000, o6: 10000, o10: 2500 },
    Mazepin: { o1: 300000, o3: 100000, o6: 10000, o10: 2500 },
    Russell: { o1: 200000, o3: 50000, o6: 2000, o10: 600 },
    Latifi: { o1: 300000, o3: 100000, o6: 10000, o10: 1200 },
  },
};

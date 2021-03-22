import type { OddsTable } from "./types";

export const season: { [race: string]: OddsTable } = {
  bahrain: {
    Hamilton: { o1: 150, o3: -300, o6: -500, o10: -800 },
    Bottas: { o1: 500, o3: -140, o6: -300, o10: -600 },
    Verstappen: { o1: 150, o3: -325, o6: -500, o10: -800 },
    Perez: { o1: 700, o3: 110, o6: -275, o10: -600 },
    Leclerc: { o1: 6600, o3: 1400, o6: 150, o10: -190 },
    Sainz: { o1: 10000, o3: 2500, o6: 500, o10: -125 },
    Ricciardo: { o1: 2800, o3: 400, o6: -150, o10: -400 },
    Norris: { o1: 3300, o3: 600, o6: -120, o10: -300 },
    Stroll: { o1: 6600, o3: 1400, o6: 150, o10: -190 },
    Vettel: { o1: 5000, o3: 1400, o6: 150, o10: -190 },
    Alonso: { o1: 10000, o3: 2500, o6: 500, o10: -140 },
    Ocon: { o1: 10000, o3: 2500, o6: 500, o10: -125 },
    Gasly: { o1: 5000, o3: 800, o6: 120, o10: -275 },
    Tsunoda: { o1: 5000, o3: 2000, o6: 300, o10: -165 },
    Raikkonnen: { o1: 25000, o3: 10000, o6: 1000, o10: 300 },
    Giovinazzi: { o1: 25000, o3: 10000, o6: 1000, o10: 300 },
    Schumacher: { o1: 300000, o3: 100000, o6: 10000, o10: 2000 },
    Mazepin: { o1: 300000, o3: 100000, o6: 100000, o10: 2000 },
    Russell: { o1: 50000, o3: 10000, o6: 1000, o10: 300 },
    Latifi: { o1: 200000, o3: 100000, o6: 10000, o10: 750 },
  },
};

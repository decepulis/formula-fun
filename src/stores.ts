import { writable, derived } from "svelte/store";

import type {
  Driver,
  Adjustment,
  OddsTable,
  PercentTable,
  PercentRow,
  CostTable,
  CostRow,
  PlaysMap,
  PlaysTable,
  PlaysRow,
  Play,
} from "./types";

const initialOddsTable: OddsTable = {
  Hamilton: { o1: 165, o3: -500, o6: -700, o10: -1000 },
  Bottas: { o1: 450, o3: -400, o6: -625, o10: -800 },
  Verstappen: { o1: 165, o3: -300, o6: -500, o10: -600 },
  Perez: { o1: 700, o3: 300, o6: -250, o10: -400 },
  Leclerc: { o1: 6600, o3: 2800, o6: 300, o10: -150 },
  Sainz: { o1: 10000, o3: 4000, o6: 800, o10: 120 },
  Ricciardo: { o1: 2500, o3: 800, o6: 175, o10: -200 },
  Norris: { o1: 3300, o3: 1600, o6: 175, o10: -250 },
  Stroll: { o1: 6600, o3: 1600, o6: 175, o10: -250 },
  Vettel: { o1: 5000, o3: 800, o6: -140, o10: -300 },
  Alonso: { o1: 10000, o3: 300, o6: -175, o10: -400 },
  Ocon: { o1: 10000, o3: 700, o6: 160, o10: -280 },
  Gasly: { o1: 5000, o3: 2500, o6: 200, o10: -200 },
  Tsunoda: { o1: 6600, o3: 2500, o6: 275, o10: -150 },
  Raikkonnen: { o1: 25000, o3: 100000, o6: 10000, o10: 400 },
  Giovinazzi: { o1: 25000, o3: 25000, o6: 10000, o10: 400 },
  Schumacher: { o1: 300000, o3: 200000, o6: 10000, o10: 2000 },
  Mazepin: { o1: 300000, o3: 150000, o6: 10000, o10: 900 },
  Russell: { o1: 50000, o3: 3300, o6: 5000, o10: 250 },
  Latifi: { o1: 200000, o3: 200000, o6: 10000, o10: 2000 },
};

export const oddsTable = writable(initialOddsTable);

// The algorithm for the cost table is a bit weird.
//
// For each finishing category, x, the driver's % chance of succeeding
// is calculated like so: p(x) = 100/d(x).
// where d(x) is the decimal representation of o(x).
// If o(x) <= 100, d(x) = 1 - 100 / o(x)
// If o(x) >= 100, d(x) = 1 + o(x)/100
//
//
// Then, that driver's four p(x) are averaged.
// We'll call that pAvg.
//
// Then, the pAvg is converted into a price.
//
// Each p(x) category gets
// and adjustment score.
// That score is the sum of all drivers' score_x, divided by x.
// E.g., adj3 = sum(p(3)) / 3
// The four adjustment components are averaged (adjAvg)
//
// And then each driver gets a price = pAvg/(adjAvg / 100).
// That price is the cost!

function updatePercentTable($oddsTable: OddsTable): PercentTable {
  const percentEntries = Object.entries($oddsTable).map(
    ([driver, { o1, o3, o6, o10 }]) => {
      const d1 = o1 <= -100 ? 1 - 100 / o1 : o1 >= 100 ? 1 + o1 / 100 : NaN;
      const p1 = 100 / d1;
      const d3 = o3 <= -100 ? 1 - 100 / o3 : o3 >= 100 ? 1 + o3 / 100 : NaN;
      const p3 = 100 / d3;
      const d6 = o6 <= -100 ? 1 - 100 / o6 : o6 >= 100 ? 1 + o6 / 100 : NaN;
      const p6 = 100 / d6;
      const d10 =
        o10 <= -100 ? 1 - 100 / o10 : o10 >= 100 ? 1 + o10 / 100 : NaN;
      const p10 = 100 / d10;
      const pAvg = (p1 + p3 + p6 + p10) / 4;
      return [driver, { p1, p3, p6, p10, pAvg }];
    }
  );
  return Object.fromEntries(percentEntries);
}

export const percentTable = derived(oddsTable, updatePercentTable);

function updateAdjustment($percentTable: PercentTable): Adjustment {
  const adj1 = Object.values($percentTable).reduce(
    (acc, percentRow) => acc + percentRow.p1,
    0
  );
  const adj3 =
    (1 / 3) *
    Object.values($percentTable).reduce(
      (acc, percentRow) => acc + percentRow.p3,
      0
    );
  const adj6 =
    (1 / 6) *
    Object.values($percentTable).reduce(
      (acc, percentRow) => acc + percentRow.p6,
      0
    );
  const adj10 =
    (1 / 10) *
    Object.values($percentTable).reduce(
      (acc, percentRow) => acc + percentRow.p10,
      0
    );

  const adjAvg = (adj1 + adj3 + adj6 + adj10) / 4;

  return {
    adj1,
    adj3,
    adj6,
    adj10,
    adjAvg,
  };
}

export const adjustment = derived(percentTable, updateAdjustment);

// Alright! We're ready to calculate what everything costs!
// While we're at it, we're actually also really well-positioned to calculate
// what we'll get for that price, too.
// We calculate two "expected points":
// one with the naive assumption that cost maps perfectly to finishing place,
// and a second that tries to use the odds to guess how many points
// each driver will actually score.
const bonusLookup = {
  9: 1.5,
  8: 2,
  7: 2.5,
  6: 3,
  5: 3.5,
  4: 4,
  3: 4.5,
  2: 5,
  1: 5,
};
const points = {
  1: 20,
  2: 18,
  3: 16,
  4: 14,
  5: 12,
  6: 10,
  7: 8,
  8: 6,
  9: 4,
  10: 3,
  11: 2,
  12: 1,
};
function linearMap(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  input: number
): number {
  const m = (y2 - y1) / (x2 - x1);
  const b = -1 * (m * x1 - y1);
  return m * input + b;
}

function updateCostTable([$percentTable, { adjAvg }]: [
  PercentTable,
  Adjustment
]): CostTable {
  // Use percentages to calculate
  // cost, bonus, and weighted expectation
  const costEntries: [Driver, CostRow][] = Object.entries($percentTable).map(
    ([driver, { p1, p3, p6, p10, pAvg }]: [Driver, PercentRow]) => {
      const cost = Math.round(pAvg / (adjAvg / 100));
      const bonus = bonusLookup[cost];

      const interpolatedProbabilities = [
        p1,
        linearMap(3, p3, 1, p1, 2),
        p3,
        linearMap(6, p6, 3, p3, 4),
        linearMap(6, p6, 3, p3, 5),
        p6,
        linearMap(10, p10, 6, p6, 7),
        linearMap(10, p10, 6, p6, 8),
        linearMap(10, p10, 6, p6, 9),
        p10,
        linearMap(20, 1, 10, p10, 11),
        linearMap(20, 1, 10, p10, 12),
      ];
      const expectedPoints = interpolatedProbabilities.map(
        (pIndex, index) => ((points[index + 1] * pIndex) / 100) * (bonus ?? 1)
      );
      const averageExpectedPoints =
        expectedPoints.reduce((sum, point) => sum + point, 0) / 12;

      return [
        driver,
        {
          cost,
          bonus,
          naivePoints: NaN,
          weightedPoints: averageExpectedPoints,
        },
      ];
    }
  );

  // Sort cost to figure out naive expectation
  costEntries.sort(([driverA, { cost: costA }], [driverB, { cost: costB }]) =>
    costA < costB ? 1 : costA > costB ? -1 : 0
  );

  costEntries.forEach(([driver, costRow], index) => {
    costRow.naivePoints = (points[index + 1] ?? 0) * (costRow.bonus ?? 1);
  });

  return Object.fromEntries(costEntries) as CostTable;
}

export const costTable = derived([percentTable, adjustment], updateCostTable);

// Finally, let's see what we can come up with for $100...

const budget = 100;

function calculatePlay(
  costArr: number[],
  naivePointsArr: number[],
  weightedPointsArr: number[]
): Play | undefined {
  const cost = costArr.reduce((sum, cost) => sum + (cost ?? 0), 0);

  if (cost <= budget) {
    const budgetPoints = (budget - cost) * 0.1;
    const naivePoints =
      naivePointsArr.reduce((sum, points) => sum + points, 0) + budgetPoints;
    const weightedPoints =
      weightedPointsArr.reduce((sum, points) => sum + points, 0) +
      budgetPoints / 3;
    return {
      cost,
      naivePoints,
      weightedPoints,
    };
  }
  return undefined;
}

function updatePlaysTable($costTable: CostTable): PlaysTable {
  // This is a basic knapsack problem, says the internet.
  // When I get around to optimizing, I'll have to look at that.
  //
  // For now, though, I'll just try every combination.
  // This is naive. Please don't judge me.
  // I'm just trying to not prematurely optimize!
  const playsMap: PlaysMap = new Map();

  Object.entries($costTable).forEach(
    ([
      driverA,
      { cost: costA, naivePoints: naiveA, weightedPoints: weightedA },
    ]: [Driver, CostRow]) => {
      // Pick 1
      const aKey = [driverA].sort().join(", ");
      const aPlay = calculatePlay([costA], [naiveA], [weightedA]);
      playsMap.set(aKey, aPlay);

      Object.entries($costTable).forEach(
        ([
          driverB,
          { cost: costB, naivePoints: naiveB, weightedPoints: weightedB },
        ]: [Driver, CostRow]) => {
          // Pick 2
          if (driverA === driverB) {
            return;
          }
          const abKey = [driverA, driverB].sort().join(", ");
          if (!playsMap.has(abKey)) {
            const abPlay = calculatePlay(
              [costA, costB],
              [naiveA, naiveB],
              [weightedA, weightedB]
            );
            playsMap.set(abKey, abPlay);
          }

          Object.entries($costTable).forEach(
            ([
              driverC,
              { cost: costC, naivePoints: naiveC, weightedPoints: weightedC },
            ]: [Driver, CostRow]) => {
              // Pick 3
              if (driverA === driverC || driverB === driverC) {
                return;
              }
              const abcKey = [driverA, driverB, driverC].sort().join(", ");
              if (!playsMap.has(abcKey)) {
                const abcPlay = calculatePlay(
                  [costA, costB, costC],
                  [naiveA, naiveB, naiveC],
                  [weightedA, weightedB, weightedC]
                );
                playsMap.set(abcKey, abcPlay);
              }

              Object.entries($costTable).forEach(
                ([
                  driverD,
                  {
                    cost: costD,
                    naivePoints: naiveD,
                    weightedPoints: weightedD,
                  },
                ]: [Driver, CostRow]) => {
                  // Pick 4
                  if (
                    driverA === driverD ||
                    driverB === driverD ||
                    driverC === driverD
                  ) {
                    return;
                  }
                  const abcdKey = [driverA, driverB, driverC, driverD]
                    .sort()
                    .join(", ");
                  if (!playsMap.has(abcdKey)) {
                    const abcdPlay = calculatePlay(
                      [costA, costB, costC, costD],
                      [naiveA, naiveB, naiveC, naiveD],
                      [weightedA, weightedB, weightedC, weightedD]
                    );
                    playsMap.set(abcdKey, abcdPlay);
                  }
                }
              );
            }
          );
        }
      );
    }
  );

  const playsTable = [...playsMap]
    .filter(([drivers, play]) => typeof play !== "undefined")
    .map(([drivers, play]) => ({ drivers, ...play }));

  return playsTable;
}

export const playsTable = derived(costTable, updatePlaysTable);

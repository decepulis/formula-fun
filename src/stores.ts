import { writable, derived } from "svelte/store";

import type {
  Driver,
  Adjustment,
  OddsTable,
  OddsRow,
  PercentTable,
  PercentRow,
  CostTable,
  CostRow,
  PlaysMap,
  PlaysTable,
  PlaysRow,
  Play,
  ExpectedPointsRow,
  ExpectedPointsTable,
} from "./types";

const initialOddsTable: OddsTable = {
  Hamilton: { o_1: 165, o_3: -500, o_6: -700, o_10: -1000 },
  Bottas: { o_1: 450, o_3: -400, o_6: -625, o_10: -800 },
  Verstappen: { o_1: 165, o_3: -300, o_6: -500, o_10: -600 },
  Perez: { o_1: 700, o_3: 300, o_6: -250, o_10: -400 },
  Leclerc: { o_1: 6600, o_3: 2800, o_6: 300, o_10: -150 },
  Sainz: { o_1: 10000, o_3: 4000, o_6: 800, o_10: 120 },
  Ricciardo: { o_1: 2500, o_3: 800, o_6: 175, o_10: -200 },
  Norris: { o_1: 3300, o_3: 1600, o_6: 175, o_10: -250 },
  Stroll: { o_1: 6600, o_3: 1600, o_6: 175, o_10: -250 },
  Vettel: { o_1: 5000, o_3: 800, o_6: -140, o_10: -300 },
  Alonso: { o_1: 10000, o_3: 300, o_6: -175, o_10: -400 },
  Ocon: { o_1: 10000, o_3: 700, o_6: 160, o_10: -280 },
  Gasly: { o_1: 5000, o_3: 2500, o_6: 200, o_10: -200 },
  Tsunoda: { o_1: 6600, o_3: 2500, o_6: 275, o_10: -150 },
  Raikkonnen: { o_1: 25000, o_3: 100000, o_6: 10000, o_10: 400 },
  Giovinazzi: { o_1: 25000, o_3: 25000, o_6: 10000, o_10: 400 },
  Schumacher: { o_1: 300000, o_3: 200000, o_6: 10000, o_10: 2000 },
  Mazepin: { o_1: 300000, o_3: 150000, o_6: 10000, o_10: 900 },
  Russell: { o_1: 50000, o_3: 3300, o_6: 5000, o_10: 250 },
  Latifi: { o_1: 200000, o_3: 200000, o_6: 10000, o_10: 2000 },
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
// We'll call that p_avg.
//
// Then, the p_avg is converted into a price.
//
// Each p(x) category gets
// and adjustment score.
// That score is the sum of all drivers' score_x, divided by x.
// E.g., adj_3 = sum(p(3)) / 3
// The four adjustment components are averaged (adj_avg)
//
// And then each driver gets a price = p_avg/(adj_avg / 100).
// That price is the cost!

function updatePercentTable($oddsTable: OddsTable): PercentTable {
  const percentEntries = Object.entries($oddsTable).map(
    ([driver, { o_1, o_3, o_6, o_10 }]) => {
      const d_1 =
        o_1 <= -100 ? 1 - 100 / o_1 : o_1 >= 100 ? 1 + o_1 / 100 : NaN;
      const p_1 = 100 / d_1;
      const d_3 =
        o_3 <= -100 ? 1 - 100 / o_3 : o_3 >= 100 ? 1 + o_3 / 100 : NaN;
      const p_3 = 100 / d_3;
      const d_6 =
        o_6 <= -100 ? 1 - 100 / o_6 : o_6 >= 100 ? 1 + o_6 / 100 : NaN;
      const p_6 = 100 / d_6;
      const d_10 =
        o_10 <= -100 ? 1 - 100 / o_10 : o_10 >= 100 ? 1 + o_10 / 100 : NaN;
      const p_10 = 100 / d_10;
      const p_avg = (p_1 + p_3 + p_6 + p_10) / 4;
      return [driver, { p_1, p_3, p_6, p_10, p_avg }];
    }
  );
  return Object.fromEntries(percentEntries);
}

export const percentTable = derived(oddsTable, updatePercentTable);

function updateAdjustment($percentTable: PercentTable): Adjustment {
  const adj_1 = Object.values($percentTable).reduce(
    (acc, percentRow) => acc + percentRow.p_1,
    0
  );
  const adj_3 =
    (1 / 3) *
    Object.values($percentTable).reduce(
      (acc, percentRow) => acc + percentRow.p_3,
      0
    );
  const adj_6 =
    (1 / 6) *
    Object.values($percentTable).reduce(
      (acc, percentRow) => acc + percentRow.p_6,
      0
    );
  const adj_10 =
    (1 / 10) *
    Object.values($percentTable).reduce(
      (acc, percentRow) => acc + percentRow.p_10,
      0
    );

  const adj_avg = (adj_1 + adj_3 + adj_6 + adj_10) / 4;

  return {
    adj_1,
    adj_3,
    adj_6,
    adj_10,
    adj_avg,
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

function updateCostTable([$percentTable, { adj_avg }]: [
  PercentTable,
  Adjustment
]): CostTable {
  // Use percentages to calculate
  // cost, bonus, and weighted expectation
  const costEntries: [Driver, CostRow][] = Object.entries($percentTable).map(
    ([driver, { p_1, p_3, p_6, p_10, p_avg }]: [Driver, PercentRow]) => {
      const cost = Math.round(p_avg / (adj_avg / 100));
      const bonus = bonusLookup[cost];

      const interpolatedProbabilities = [
        p_1,
        linearMap(3, p_3, 1, p_1, 2),
        p_3,
        linearMap(6, p_6, 3, p_3, 4),
        linearMap(6, p_6, 3, p_3, 5),
        p_6,
        linearMap(10, p_10, 6, p_6, 7),
        linearMap(10, p_10, 6, p_6, 8),
        linearMap(10, p_10, 6, p_6, 9),
        p_10,
        linearMap(20, 1, 10, p_10, 11),
        linearMap(20, 1, 10, p_10, 12),
      ];
      const expectedPoints = interpolatedProbabilities.map(
        (p_idx, idx) => ((points[idx + 1] * p_idx) / 100) * (bonus ?? 1)
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
    const naivePoints = naivePointsArr.reduce((sum, points) => sum + points, 0);
    const weightedPoints = weightedPointsArr.reduce(
      (sum, points) => sum + points,
      0
    );
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

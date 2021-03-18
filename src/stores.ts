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
function updateCostTable([$percentTable, { adj_avg }]: [
  PercentTable,
  Adjustment
]): CostTable {
  const costEntries = Object.entries($percentTable).map(
    ([driver, { p_avg }]) => {
      const cost = Math.round(p_avg / (adj_avg / 100));
      const bonus = bonusLookup[cost];
      return [driver, { cost, bonus }];
    }
  );
  return Object.fromEntries(costEntries);
}

export const costTable = derived([percentTable, adjustment], updateCostTable);

// Awesome! Now that we've got costs.
// let's figure out what's the most bang for our buck that we can get for $100.
// Reminder, $100 to buy 1, 2, 3, or 4 races.
// Every unused $ equals 1 driver point.
// What score will each driver receive? Let's begin with the naive assumption
// that price ranking correlates perfectly to race ranking.
const finishPoints = {
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
const budget = 100;

function calculatePlay(
  finishIndices: number[],
  costs: number[],
  bonuses: number[]
): Play | undefined {
  const cost = costs.reduce((sum, cost) => sum + (cost ?? 0), 0);

  if (cost <= budget) {
    const points = finishIndices.reduce(
      (sum, finishIndex, idx) =>
        sum + (finishPoints[finishIndex + 1] ?? 0) * (bonuses[idx] ?? 1),
      0
    );
    return {
      cost,
      points,
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

  const sortedCosts = Object.entries(
    $costTable
  ).sort(([driverA, { cost: costA }], [driverB, { cost: costB }]) =>
    costA < costB ? 1 : costA > costB ? -1 : 0
  );

  sortedCosts.forEach(
    ([driverA, { cost: costA, bonus: bonusA }]: [Driver, CostRow], indexA) => {
      // Pick 1
      const aKey = [driverA].sort().join(", ");
      const aPlay = calculatePlay([indexA], [costA], [bonusA]);
      playsMap.set(aKey, aPlay);

      sortedCosts.forEach(
        (
          [driverB, { cost: costB, bonus: bonusB }]: [Driver, CostRow],
          indexB
        ) => {
          // Pick 2
          if (driverA === driverB) {
            return;
          }
          const abKey = [driverA, driverB].sort().join(", ");
          if (!playsMap.has(abKey)) {
            const abPlay = calculatePlay(
              [indexA, indexB],
              [costA, costB],
              [bonusA, bonusB]
            );
            playsMap.set(abKey, abPlay);
          }

          sortedCosts.forEach(
            (
              [driverC, { cost: costC, bonus: bonusC }]: [Driver, CostRow],
              indexC
            ) => {
              // Pick 3
              if (driverA === driverC || driverB === driverC) {
                return;
              }
              const abcKey = [driverA, driverB, driverC].sort().join(", ");
              if (!playsMap.has(abcKey)) {
                const abcPlay = calculatePlay(
                  [indexA, indexB, indexC],
                  [costA, costB, costC],
                  [bonusA, bonusB, bonusC]
                );
                playsMap.set(abcKey, abcPlay);
              }

              sortedCosts.forEach(
                (
                  [driverD, { cost: costD, bonus: bonusD }]: [Driver, CostRow],
                  indexD
                ) => {
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
                      [indexA, indexB, indexC, indexD],
                      [costA, costB, costC, costD],
                      [bonusA, bonusB, bonusC, bonusD]
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
    .map(([drivers, play]) => ({ drivers, ...play }))
    .sort(({ points: pointsA }, { points: pointsB }) =>
      pointsA < pointsB ? 1 : pointsA > pointsB ? -1 : 0
    );

  return playsTable;
}

export const playsTable = derived(costTable, updatePlaysTable);

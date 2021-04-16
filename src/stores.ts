import { writable, derived } from "svelte/store";
import { season } from "./season";

import type {
  Driver,
  Adjustment,
  OddsTable,
  PercentTable,
  PercentRow,
  CostTable,
  PlaysTable,
  Play,
  PointsTable,
  PointsRow,
  PredictionTable,
  EnabledTable,
  Team,
  PlaysRow,
  PointsKey,
  ScoreKey,
} from "./types";

export const driverTeam: Record<Driver, Team> = {
  Hamilton: "Mercedes",
  Bottas: "Mercedes",
  Ocon: "Alpine",
  Alonso: "Alpine",
  Schumacher: "Haas",
  Mazepin: "Haas",
  Norris: "McLaren",
  Ricciardo: "McLaren",
  Raikkonnen: "Alfa Romeo",
  Giovinazzi: "Alfa Romeo",
  Verstappen: "Red Bull",
  Perez: "Red Bull",
  Stroll: "Aston Martin",
  Vettel: "Aston Martin",
  Leclerc: "Ferrari",
  Sainz: "Ferrari",
  Gasly: "AlphaTauri",
  Tsunoda: "AlphaTauri",
  Russell: "Williams",
  Latifi: "Williams",
};

const currentRaceIndex = season.length - 1;
const initialRaceIndex: number =
  JSON.parse(localStorage.getItem("raceIndex")) ?? currentRaceIndex;
export const activeRaceIndex = writable(initialRaceIndex);
activeRaceIndex.subscribe((value) =>
  localStorage.setItem("raceIndex", JSON.stringify(value))
);

function updateOddsTable($activeRaceIndex: number): OddsTable {
  return season[$activeRaceIndex].odds;
}
export const oddsTable = derived(activeRaceIndex, updateOddsTable);

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
const availablePoints = Object.values(points).reduce(
  (sum, point) => sum + point,
  0
);
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
  const costEntries = Object.entries($percentTable).map(
    ([driver, { pAvg }]: [Driver, PercentRow]) => {
      const cost = Math.round(pAvg / (adjAvg / 100));
      const bonus = bonusLookup[cost] ?? 1;
      return [
        driver,
        {
          cost,
          bonus,
        },
      ];
    }
  );

  return Object.fromEntries(costEntries);
}

export const costTable = derived([percentTable, adjustment], updateCostTable);

const initialPredictionTables: PredictionTable[] =
  JSON.parse(localStorage.getItem("predictionTables")) ?? [];
export const predictionTables = writable(initialPredictionTables);
predictionTables.subscribe((value) =>
  localStorage.setItem("predictionTables", JSON.stringify(value))
);

// Now, let's figure out how much each player is worth using our three algorithms!
function updatePointsTable([
  $activeRaceIndex,
  $predictionTables,
  $costTable,
  $percentTable,
]: [number, PredictionTable[], CostTable, PercentTable]): PointsTable {
  const pointsTable: { [driver: string]: PointsRow } = {};
  // What's available cost? stay tuned for Algorithm 2.
  const availableCost = Object.values($costTable).reduce(
    (sum, { cost }) => sum + cost,
    0
  );

  // Iterate through the cost table and run our three algorithms along the way
  const activePredictionTable = $predictionTables[$activeRaceIndex];
  for (const driver of Object.keys($costTable)) {
    // -- Algorithm 1: Rank Algorithm --
    // We just let the user input what they think the driver's gonna get
    const predictionPoints = activePredictionTable?.[driver] ?? 0;

    // -- Algorithm 2: Cost Algorithm --
    // All points are distributed among the racers
    // according to how much they cost
    //
    // e.g.,
    // there are 114 points to be had.
    // all the racers together are worth $488
    // if Hamilton is worth $72,
    // he should win about 114 * 72 / 488 = 16.82 points
    const { cost } = $costTable[driver];
    const costPoints = availablePoints * (cost / availableCost);

    // -- Algorithm 3: Odds Algorithm --
    // From the betting website, we have the following odds:
    // p(1), p(>=3), p(>=6), and p(>=10)
    //
    // Those >= odds together actually form something that looks like
    // a cumulative distribution function!
    // With a bit of interpolation and statistics,
    // we can use that cdf to calculate a probability mass function (pmf),
    // sometimes called a pdf,
    // and then use that to calculate an expected value! Yay statistics!
    const { p1, p3, p6, p10 } = $percentTable[driver];
    const cumulativeDistributionFunction = [
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
    const probabilityMassFunction = cumulativeDistributionFunction.map(
      (cpIndex, index, cdf) =>
        index === 0 ? cpIndex : cpIndex - cdf[index - 1]
    );
    const oddsPoints = probabilityMassFunction.reduce(
      (sum, pIndex, index) => sum + (points[index + 1] * pIndex) / 100,
      0
    );

    pointsTable[driver] = {
      predictionPoints,
      costPoints,
      oddsPoints,
    };
  }

  return pointsTable as PointsTable;
}

export const pointsTable = derived(
  [activeRaceIndex, predictionTables, costTable, percentTable],
  updatePointsTable
);

const initialEnabledTables: EnabledTable[] =
  JSON.parse(localStorage.getItem("enabledTables")) ?? [];

export const enabledTables = writable(initialEnabledTables);
enabledTables.subscribe((value) =>
  localStorage.setItem("enabledTables", JSON.stringify(value))
);

// Finally, let's see what we can come up with for $100...
const budget = 100;

function calculatePlay(
  costArr: number[],
  bonusArr: number[],
  predictionPointsArr: number[],
  costPointsArr: number[],
  oddsPointsArr: number[]
): Play | undefined {
  const cost = costArr.reduce((sum, cost) => sum + (cost ?? 0), 0);

  if (cost <= budget) {
    const budgetPoints = (budget - cost) * 0.1;

    const predictionTotal =
      budgetPoints +
      predictionPointsArr.reduce(
        (sum, points, index) => sum + points * bonusArr[index],
        0
      );
    const costTotal =
      budgetPoints +
      costPointsArr.reduce(
        (sum, points, index) => sum + points * bonusArr[index],
        0
      );
    const oddsTotal =
      budgetPoints +
      oddsPointsArr.reduce(
        (sum, points, index) => sum + points * bonusArr[index],
        0
      );

    return {
      cost,
      predictionPoints: predictionTotal,
      costPoints: costTotal,
      oddsPoints: oddsTotal,
    };
  }
  return undefined;
}

const scoreKeys: Record<PointsKey, ScoreKey> = {
  predictionPoints: "predictionScore",
  costPoints: "costScore",
  oddsPoints: "oddsScore",
};
function scorePlaysForKey(plays: PlaysRow[], key: PointsKey): PlaysRow[] {
  // This is bad typescript, isn't it?
  plays.sort((playA, playB) => playB[key] - playA[key]);

  const scoredPlays: PlaysRow[] = [...plays];
  const scoreKey = scoreKeys[key];
  for (const [thisIndex, thisPlay] of scoredPlays.entries()) {
    const prevPlay = scoredPlays[thisIndex - 1];

    const thisScore = 100 - 100 * (thisIndex / scoredPlays.length);
    scoredPlays[thisIndex] = {
      ...thisPlay,
      [scoreKey]:
        prevPlay?.[key] === thisPlay[key] ? prevPlay?.[scoreKey] : thisScore,
    };
  }
  return scoredPlays;
}
function scorePlays(plays: PlaysRow[]): PlaysRow[] {
  const oneScore = scorePlaysForKey(plays, "predictionPoints");
  const twoScores = scorePlaysForKey(oneScore, "costPoints");
  const allScores = scorePlaysForKey(twoScores, "oddsPoints");

  const allScoresCombined = allScores.map((play) => ({
    ...play,
    combinedScore: (play.predictionScore + play.costScore + play.oddsScore) / 3,
  }));

  return allScoresCombined;
}

function calculateKey(driverArr: string[], costArr: number[]) {
  // zip drivers and cost together
  const driversAndCost: [string, number][] = driverArr.map((driver, index) => [
    driver,
    costArr[index],
  ]);
  // sort by cost
  driversAndCost.sort(([driverA, costA], [driverB, costB]) => {
    const keyA = costA === costB ? driverA : costA;
    const keyB = costA === costB ? driverB : costB;
    return keyA < keyB ? 1 : keyA > keyB ? -1 : 0;
  });
  // isolate drivers
  return driversAndCost.map(([driver]) => driver).join(",");
}
function updatePlaysTable([$costTable, $pointsTable]: [
  CostTable,
  PointsTable
]): PlaysTable {
  // This is a basic knapsack problem, says the internet.
  // When I get around to optimizing, I'll have to look at that.
  //
  // For now, though, I'll just try every combination.
  // This is naive. Please don't judge me.
  // I'm just trying to not prematurely optimize!
  const playsByKey: { [key: string]: Play } = {};

  for (const [driverA, { cost: costA, bonus: bonusA }] of Object.entries(
    $costTable
  )) {
    // pick 1
    const {
      predictionPoints: predictionPointsA,
      costPoints: costPointsA,
      oddsPoints: oddsPointsA,
    } = $pointsTable[driverA];

    const aKey = calculateKey([driverA], [costA]);
    const aPlay = calculatePlay(
      [costA],
      [bonusA],
      [predictionPointsA],
      [costPointsA],
      [oddsPointsA]
    );

    playsByKey[aKey] = aPlay;

    for (const [driverB, { cost: costB, bonus: bonusB }] of Object.entries(
      $costTable
    )) {
      // pick 2
      if (driverA === driverB) continue;

      const {
        predictionPoints: predictionPointsB,
        costPoints: costPointsB,
        oddsPoints: oddsPointsB,
      } = $pointsTable[driverB];

      const abKey = calculateKey([driverA, driverB], [costA, costB]);
      if (!playsByKey.hasOwnProperty(abKey)) {
        const abPlay = calculatePlay(
          [costA, costB],
          [bonusA, bonusB],
          [predictionPointsA, predictionPointsB],
          [costPointsA, costPointsB],
          [oddsPointsA, oddsPointsB]
        );

        playsByKey[abKey] = abPlay;
      }

      for (const [driverC, { cost: costC, bonus: bonusC }] of Object.entries(
        $costTable
      )) {
        // pick 3
        if (driverA === driverC || driverB === driverC) continue;

        const {
          predictionPoints: predictionPointsC,
          costPoints: costPointsC,
          oddsPoints: oddsPointsC,
        } = $pointsTable[driverC];

        const abcKey = calculateKey(
          [driverA, driverB, driverC],
          [costA, costB, costC]
        );
        if (!playsByKey.hasOwnProperty(abcKey)) {
          const abcPlay = calculatePlay(
            [costA, costB, costC],
            [bonusA, bonusB, bonusC],
            [predictionPointsA, predictionPointsB, predictionPointsC],
            [costPointsA, costPointsB, costPointsC],
            [oddsPointsA, oddsPointsB, oddsPointsC]
          );

          playsByKey[abcKey] = abcPlay;
        }

        for (const [driverD, { cost: costD, bonus: bonusD }] of Object.entries(
          $costTable
        )) {
          // pick 4
          if (driverA === driverD || driverB === driverD || driverC === driverD)
            continue;

          const {
            predictionPoints: predictionPointsD,
            costPoints: costPointsD,
            oddsPoints: oddsPointsD,
          } = $pointsTable[driverD];

          const abcdKey = calculateKey(
            [driverA, driverB, driverC, driverD],
            [costA, costB, costC, costD]
          );
          if (!playsByKey.hasOwnProperty(abcdKey)) {
            const abcdPlay = calculatePlay(
              [costA, costB, costC, costD],
              [bonusA, bonusB, bonusC, bonusD],
              [
                predictionPointsA,
                predictionPointsB,
                predictionPointsC,
                predictionPointsD,
              ],
              [costPointsA, costPointsB, costPointsC, costPointsD],
              [oddsPointsA, oddsPointsB, oddsPointsC, oddsPointsD]
            );

            playsByKey[abcdKey] = abcdPlay;
          }
        }
      }
    }
  }

  // And now we translate the object up above to something more tabular...
  // and take note of where each strategy ranks
  const unscoredPlaysTable = Object.entries(playsByKey)
    .filter(([, play]) => typeof play !== "undefined")
    .map(([drivers, play]) => ({
      drivers: drivers.split(",") as Driver[],
      predictionScore: 0, // we'll write these indices momentarily
      costScore: 0,
      oddsScore: 0,
      combinedScore: 0,
      ...play,
    }));

  // Finally, we take note of each play's ranking
  // in each strategy using the <play>Score key,
  // repeating indices in the case of a tie
  const playsTable = scorePlays(unscoredPlaysTable);

  return playsTable;
}

export const playsTable = derived([costTable, pointsTable], updatePlaysTable);

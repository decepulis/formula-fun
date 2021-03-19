const season = require("./season2020");

// So in this script,
// we'll be running my gnarly algorithm
// that tries to calculate expected points for each driver
// by the odds they have to finish in each place
// as determined by the p(1), p(>=3), p(>=6), and p(>=10) odds
// from a betting website.

// Like in our main app,
// we'll be brute-force checking every permutation of 4 drivers.
const budget = 100;
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

function linearMap(x1, y1, x2, y2, input) {
  const m = (y2 - y1) / (x2 - x1);
  const b = -1 * (m * x1 - y1);
  return m * input + b;
}
function predictPoints({ driver, o1, o3, o6, o10 }) {
  // from american odds to decimal to probability
  const d1 = o1 <= -100 ? 1 - 100 / o1 : o1 >= 100 ? 1 + o1 / 100 : NaN;
  const p1 = 1 / d1;
  const d3 = o3 <= -100 ? 1 - 100 / o3 : o3 >= 100 ? 1 + o3 / 100 : NaN;
  const p3 = 1 / d3;
  const d6 = o6 <= -100 ? 1 - 100 / o6 : o6 >= 100 ? 1 + o6 / 100 : NaN;
  const p6 = 1 / d6;
  const d10 = o10 <= -100 ? 1 - 100 / o10 : o10 >= 100 ? 1 + o10 / 100 : NaN;
  const p10 = 1 / d10;

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
    (cpIndex, index, cdf) => (index === 0 ? cpIndex : cpIndex - cdf[index - 1])
  );

  const expectedPoints = probabilityMassFunction.reduce(
    (sum, pIndex, index) => sum + points[index + 1] * pIndex,
    0
  );
  if (driver === "Aitken") {
    console.log();
  }

  return expectedPoints;
}
function calculatePlay(costArr, predictedTotalArr, actualTotalArr) {
  const cost = costArr.reduce((sum, cost) => sum + cost, 0);
  if (cost <= budget) {
    const budgetPoints = (budget - cost) * 0.1;
    const predictedTotalPoints = predictedTotalArr.reduce(
      (sum, points) => sum + points,
      0
    );
    const actualTotalPoints = actualTotalArr.reduce(
      (sum, points) => sum + points,
      0
    );
    return {
      cost,
      predictedPoints: budgetPoints + predictedTotalPoints,
      actualPoints: budgetPoints + actualTotalPoints,
    };
  }
}
function calculatePlays(drivers) {
  // This is where most of the magic happens
  // this is where we estimate how many points a driver should have
  // based on their odds
  const weightedDrivers = drivers.map((driver) => ({
    ...driver,
    predictedPoints: predictPoints(driver),
  }));

  const playsByKey = {};

  for (const {
    driver: driverA,
    cost: costA,
    bonus: bonusA,
    points: actualPointsA,
    predictedPoints: predictedPointsA,
  } of weightedDrivers) {
    // pick 1

    const predictedTotalA = predictedPointsA * bonusA;
    const actualTotalA = actualPointsA * bonusA;

    const aKey = [driverA].sort().join(", ");
    const aPlay = calculatePlay([costA], [predictedTotalA], [actualTotalA]);
    if (typeof aPlay !== "undefined") playsByKey[aKey] = aPlay;
    for (const {
      driver: driverB,
      cost: costB,
      bonus: bonusB,
      points: actualPointsB,
      predictedPoints: predictedPointsB,
    } of weightedDrivers) {
      // pick 2

      if (driverA === driverB) continue;

      const predictedTotalB = predictedPointsB * bonusB;
      const actualTotalB = actualPointsB * bonusB;

      const abKey = [driverA, driverB].sort().join(", ");
      if (!playsByKey.hasOwnProperty(abKey)) {
        const abPlay = calculatePlay(
          [costA, costB],
          [predictedTotalA, predictedTotalB],
          [actualTotalA, actualTotalB]
        );
        if (typeof abPlay !== "undefined") playsByKey[abKey] = abPlay;
      }
      for (const {
        driver: driverC,
        cost: costC,
        bonus: bonusC,
        points: actualPointsC,
        predictedPoints: predictedPointsC,
      } of weightedDrivers) {
        // pick 3

        if (driverA === driverC || driverB === driverC) continue;

        const predictedTotalC = predictedPointsC * bonusC;
        const actualTotalC = actualPointsC * bonusC;

        const abcKey = [driverA, driverB, driverC].sort().join(", ");
        if (!playsByKey.hasOwnProperty(abcKey)) {
          const abcPlay = calculatePlay(
            [costA, costB, costC],
            [predictedTotalA, predictedTotalB, predictedTotalC],
            [actualTotalA, actualTotalB, actualTotalC]
          );
          if (typeof abcPlay !== "undefined") playsByKey[abcKey] = abcPlay;
        }
        for (const {
          driver: driverD,
          cost: costD,
          bonus: bonusD,
          points: actualPointsD,
          predictedPoints: predictedPointsD,
        } of weightedDrivers) {
          // pick 4
          if (driverA === driverD || driverB === driverD || driverC === driverD)
            continue;

          const abcdKey = [driverA, driverB, driverC, driverD]
            .sort()
            .join(", ");

          const predictedTotalD = predictedPointsD * bonusD;
          const actualTotalD = actualPointsD * bonusD;

          if (!playsByKey.hasOwnProperty(abcdKey)) {
            const abcdPlay = calculatePlay(
              [costA, costB, costC, costD],
              [
                predictedTotalA,
                predictedTotalB,
                predictedTotalC,
                predictedTotalD,
              ],
              [actualTotalA, actualTotalB, actualTotalC, actualTotalD]
            );
            if (typeof abcdPlay !== "undefined") playsByKey[abcdKey] = abcdPlay;
          }
        }
      }
    }
  }
  const plays = Object.entries(playsByKey)
    .map(([key, play]) => ({
      key,
      ...play,
    }))
    .sort(({ predictedPoints: pointsA }, { predictedPoints: pointsB }) =>
      pointsA < pointsB ? 1 : pointsA > pointsB ? -1 : 0
    );
  return plays;
}
// For every race...
const p1 = [];
const p3AvgArr = [];
const p3MaxArr = [];
const p5AvgArr = [];
const p5MaxArr = [];
const p10AvgArr = [];
const p10MaxArr = [];
const p25AvgArr = [];
const p25MaxArr = [];
for (const [race, { scores, drivers }] of Object.entries(season)) {
  // calculate plays
  const plays = calculatePlays(drivers);
  console.log(race);
  console.log("picks");
  console.table(plays.slice(0, 3));

  const p1Avg = plays[0].actualPoints;

  const p3Max = Math.max(...plays.slice(0, 3).map((play) => play.actualPoints));
  const p3Avg =
    plays.slice(0, 3).reduce((sum, { actualPoints }) => sum + actualPoints, 0) /
    3;
  const p5Max = Math.max(...plays.slice(0, 5).map((play) => play.actualPoints));
  const p5Avg =
    plays.slice(0, 5).reduce((sum, { actualPoints }) => sum + actualPoints, 0) /
    5;
  const p10Max = Math.max(
    ...plays.slice(0, 10).map((play) => play.actualPoints)
  );
  const p10Avg =
    plays
      .slice(0, 10)
      .reduce((sum, { actualPoints }) => sum + actualPoints, 0) / 10;
  const p25Max = Math.max(
    ...plays.slice(0, 25).map((play) => play.actualPoints)
  );
  const p25Avg =
    plays
      .slice(0, 25)
      .reduce((sum, { actualPoints }) => sum + actualPoints, 0) / 25;

  const sortNum = (a, b) => a - b;
  const p1Rank =
    ([p1Avg, ...scores].sort(sortNum).reverse().indexOf(p1Avg) + 1) /
    (scores.length + 2);
  const p3AvgRank =
    ([p3Avg, ...scores].sort(sortNum).reverse().indexOf(p3Avg) + 1) /
    (scores.length + 2);
  const p3MaxRank =
    ([p3Max, ...scores].sort(sortNum).reverse().indexOf(p3Max) + 1) /
    (scores.length + 2);
  const p5AvgRank =
    ([p5Avg, ...scores].sort(sortNum).reverse().indexOf(p5Avg) + 1) /
    (scores.length + 2);
  const p5MaxRank =
    ([p5Max, ...scores].sort(sortNum).reverse().indexOf(p5Max) + 1) /
    (scores.length + 2);
  const p10AvgRank =
    ([p10Avg, ...scores].sort(sortNum).reverse().indexOf(p10Avg) + 1) /
    (scores.length + 2);
  const p10MaxRank =
    ([p10Max, ...scores].sort(sortNum).reverse().indexOf(p10Max) + 1) /
    (scores.length + 2);
  const p25AvgRank =
    ([p25Avg, ...scores].sort(sortNum).reverse().indexOf(p25Avg) + 1) /
    (scores.length + 2);
  const p25MaxRank =
    ([p25Max, ...scores].sort(sortNum).reverse().indexOf(p25Max) + 1) /
    (scores.length + 2);

  p1.push(p1Rank);
  p3AvgArr.push(p3AvgRank);
  p3MaxArr.push(p3MaxRank);
  p5AvgArr.push(p5AvgRank);
  p5MaxArr.push(p5MaxRank);
  p10AvgArr.push(p10AvgRank);
  p10MaxArr.push(p10MaxRank);
  p25AvgArr.push(p25AvgRank);
  p25MaxArr.push(p25MaxRank);

  console.log("results");
  console.table({
    p1Rank,
    p3AvgRank,
    p3MaxRank,
    p5AvgRank,
    p5MaxRank,
    p10AvgRank,
    p10MaxRank,
    p25AvgRank,
    p25MaxRank,
  });
}

console.table({
  p1: p1.reduce((sum, points) => sum + points, 0) / p1.length,
  p3Avg: p3AvgArr.reduce((sum, points) => sum + points, 0) / p3AvgArr.length,
  p3Max: p3MaxArr.reduce((sum, points) => sum + points, 0) / p3MaxArr.length,
  p5Avg: p5AvgArr.reduce((sum, points) => sum + points, 0) / p5AvgArr.length,
  p5Max: p5MaxArr.reduce((sum, points) => sum + points, 0) / p5MaxArr.length,
  p10Avg: p10AvgArr.reduce((sum, points) => sum + points, 0) / p10AvgArr.length,
  p10Max: p10MaxArr.reduce((sum, points) => sum + points, 0) / p10MaxArr.length,
  p25Avg: p25AvgArr.reduce((sum, points) => sum + points, 0) / p25AvgArr.length,
  p25Max: p25MaxArr.reduce((sum, points) => sum + points, 0) / p25MaxArr.length,
});

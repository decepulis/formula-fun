const season = require("./season2020");

// The idea of the cost weighted algorithm
// is that all the points will be distributed among the racers
// according to how much they cost.
//
// e.g.,
// there are 114 points to be had.
// all the racers together are worth $488
// if hamilton is worth $72,
// he should win about 114 * 72 / 488 = 16.82 points

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
const availablePoints = Object.values(points).reduce(
  (sum, point) => sum + point,
  0
);

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
      predictedPoints: (budgetPoints + predictedTotalPoints).toFixed(1),
      actualPoints: budgetPoints + actualTotalPoints,
    };
  }
}
function calculatePlays(drivers) {
  // first, we run the algorithm:
  // we estimate how many points a driver should get in a race
  // based on their price
  const availableCost = drivers.reduce((sum, { cost }) => sum + cost, 0);
  const sortedDrivers = drivers.map((driver) => ({
    ...driver,
    predictedPoints: availablePoints * (driver.cost / availableCost),
  }));

  const playsByKey = {};

  for (const {
    driver: driverA,
    cost: costA,
    bonus: bonusA,
    points: actualPointsA,
    predictedPoints: predictedPointsA,
  } of sortedDrivers) {
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
    } of sortedDrivers) {
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
      } of sortedDrivers) {
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
        } of sortedDrivers) {
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
const p3 = [];
const p5 = [];
const p10 = [];
const p25 = [];
for (const [race, { scores, drivers }] of Object.entries(season)) {
  // calculate plays
  const plays = calculatePlays(drivers);
  console.log(race);
  console.log("picks");
  console.table(plays.slice(0, 3));

  const p1Avg = plays[0].actualPoints;

  const p3Avg =
    plays.slice(0, 3).reduce((sum, { actualPoints }) => sum + actualPoints, 0) /
    3;
  const p5Avg =
    plays.slice(0, 5).reduce((sum, { actualPoints }) => sum + actualPoints, 0) /
    5;
  const p10Avg =
    plays
      .slice(0, 10)
      .reduce((sum, { actualPoints }) => sum + actualPoints, 0) / 10;
  const p25Avg =
    plays
      .slice(0, 25)
      .reduce((sum, { actualPoints }) => sum + actualPoints, 0) / 25;

  const sortNum = (a, b) => a - b;
  const p1Rank = [p1Avg, ...scores].sort(sortNum).reverse().indexOf(p1Avg) + 1;
  const p3Rank = [p3Avg, ...scores].sort(sortNum).reverse().indexOf(p3Avg) + 1;
  const p5Rank = [p5Avg, ...scores].sort(sortNum).reverse().indexOf(p5Avg) + 1;
  const p10Rank =
    [p10Avg, ...scores].sort(sortNum).reverse().indexOf(p10Avg) + 1;
  const p25Rank =
    [p25Avg, ...scores].sort(sortNum).reverse().indexOf(p25Avg) + 1;

  p1.push(p1Rank);
  p3.push(p3Rank);
  p5.push(p5Rank);
  p10.push(p10Rank);
  p25.push(p25Rank);

  console.log("results");
  console.table({
    p1Rank,
    p3Rank,
    p5Rank,
    p10Rank,
    p25Rank,
  });
}

console.table({
  p1: p1.reduce((sum, points) => sum + points, 0) / p1.length,
  p3: p3.reduce((sum, points) => sum + points, 0) / p3.length,
  p5: p5.reduce((sum, points) => sum + points, 0) / p5.length,
  p10: p10.reduce((sum, points) => sum + points, 0) / p10.length,
  p25: p25.reduce((sum, points) => sum + points, 0) / p25.length,
});

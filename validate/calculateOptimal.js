const season = require("./season2020");

// Here we're just checking out
// what would've been the best race

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

function calculatePlay(costArr, pointsArr) {
  const cost = costArr.reduce((sum, cost) => sum + cost, 0);
  if (cost <= budget) {
    const budgetPoints = (budget - cost) * 0.1;
    const points = pointsArr.reduce((sum, points) => sum + points, 0);
    return {
      cost,
      points: budgetPoints + points,
    };
  }
}
function calculatePlays(drivers) {
  const playsByKey = {};

  for (const {
    driver: driverA,
    cost: costA,
    bonus: bonusA,
    points: actualPointsA,
  } of drivers) {
    // pick 1
    const totalA = actualPointsA * bonusA;

    const aKey = [driverA].sort().join(" ");
    const aPlay = calculatePlay([costA], [totalA]);
    if (typeof aPlay !== "undefined") playsByKey[aKey] = aPlay;
    for (const {
      driver: driverB,
      cost: costB,
      bonus: bonusB,
      points: actualPointsB,
    } of drivers) {
      // pick 2
      ``;
      if (driverA === driverB) continue;

      const totalB = actualPointsB * bonusB;

      const abKey = [driverA, driverB].sort().join(" ");
      if (!playsByKey.hasOwnProperty(abKey)) {
        const abPlay = calculatePlay([costA, costB], [totalA, totalB]);
        if (typeof abPlay !== "undefined") playsByKey[abKey] = abPlay;
      }
      for (const {
        driver: driverC,
        cost: costC,
        bonus: bonusC,
        points: actualPointsC,
      } of drivers) {
        // pick 3

        if (driverA === driverC || driverB === driverC) continue;
        const totalC = actualPointsC * bonusC;

        const abcKey = [driverA, driverB, driverC].sort().join(" ");
        if (!playsByKey.hasOwnProperty(abcKey)) {
          const abcPlay = calculatePlay(
            [costA, costB, costC],
            [totalA, totalB, totalC]
          );
          if (typeof abcPlay !== "undefined") playsByKey[abcKey] = abcPlay;
        }
        for (const {
          driver: driverD,
          cost: costD,
          bonus: bonusD,
          points: actualPointsD,
        } of drivers) {
          // pick 4
          if (driverA === driverD || driverB === driverD || driverC === driverD)
            continue;

          const abcdKey = [driverA, driverB, driverC, driverD].sort().join(" ");

          const totalD = actualPointsD * bonusD;

          if (!playsByKey.hasOwnProperty(abcdKey)) {
            const abcdPlay = calculatePlay(
              [costA, costB, costC, costD],
              [totalA, totalB, totalC, totalD]
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
    .sort(({ points: pointsA }, { points: pointsB }) =>
      pointsA < pointsB ? 1 : pointsA > pointsB ? -1 : 0
    );
  return plays;
}
// For every race...
for (const [race, { drivers }] of Object.entries(season)) {
  // calculate plays
  const plays = calculatePlays(drivers);
  console.log(race);
  console.log(
    plays
      .slice(0, 25)
      .map((play) => Object.values(play).join(","))
      .forEach((play) => console.log(play))
  );
}

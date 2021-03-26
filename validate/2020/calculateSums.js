const season = require("./season2020");

const sums = {};

for (const race of Object.values(season)) {
  for (const { driver, points, bonus, cost } of race.drivers) {
    if (!sums.hasOwnProperty(driver)) {
      sums[driver] = {
        totalPoints: points * bonus,
        totalCost: cost,
        raceCount: 1,
      };
    } else {
      sums[driver]["totalPoints"] += points * bonus;
      sums[driver]["totalCost"] += cost;
      sums[driver]["raceCount"] += 1;
    }
  }
}

for (const [driver, sum] of Object.entries(sums)) {
  sums[driver] = {
    totalPoints: parseFloat(sum.totalPoints.toFixed(1)),
    averagePoints: parseFloat((sum.totalPoints / sum.raceCount).toFixed(1)),
    averageCost: parseFloat((sum.totalCost / sum.raceCount).toFixed(1)),
    costPerPoint: parseFloat((sum.totalCost / sum.totalPoints).toFixed(1)),
  };
}

console.table(sums);

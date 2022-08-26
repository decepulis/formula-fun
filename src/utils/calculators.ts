import { Drivers, Teams, teamDrivers } from '../2022';
import type { Keys } from '../2022';
import type {
	OddsTable,
	PercentTable,
	Adjustment,
	PriceTable,
	PriceRow,
	DriverPredictionTable,
	TeamPredictionTable,
	PlaysTable,
	Play
} from '../types';

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
	0: 5
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
	12: 1
};
const availablePoints = Object.values(points).reduce((sum, point) => sum + point, 0);
function linearMap(x1: number, y1: number, x2: number, y2: number, input: number): number {
	const m = (y2 - y1) / (x2 - x1);
	const b = -1 * (m * x1 - y1);
	return m * input + b;
}

export const getPercents = (oddsTable: OddsTable): PercentTable => {
	const percentEntries = Object.entries(oddsTable).map(([driver, { o1, o3, o6, o10 }]) => {
		const d1 = o1 <= -100 ? 1 - 100 / o1 : o1 >= 100 ? 1 + o1 / 100 : NaN;
		const p1 = 100 / d1;
		const d3 = o3 <= -100 ? 1 - 100 / o3 : o3 >= 100 ? 1 + o3 / 100 : NaN;
		const p3 = 100 / d3;
		const d6 = o6 <= -100 ? 1 - 100 / o6 : o6 >= 100 ? 1 + o6 / 100 : NaN;
		const p6 = 100 / d6;
		const d10 = o10 <= -100 ? 1 - 100 / o10 : o10 >= 100 ? 1 + o10 / 100 : NaN;
		const p10 = 100 / d10;
		const pAvg = (p1 + p3 + p6 + p10) / 4;
		return [driver, { p1, p3, p6, p10, pAvg }];
	});
	return Object.fromEntries(percentEntries);
};

export const getAdjustment = (percentTable: PercentTable): Adjustment => {
	const { sumP1, sumP3, sumP6, sumP10 } = Object.entries(percentTable).reduce(
		(acc, percentRow) => {
			const {
				1: { p1, p3, p6, p10 }
			} = percentRow;
			acc.sumP1 += p1;
			acc.sumP3 += p3;
			acc.sumP6 += p6;
			acc.sumP10 += p10;
			return acc;
		},
		{ sumP1: 0, sumP3: 0, sumP6: 0, sumP10: 0 }
	);

	const adj1 = sumP1;
	const adj3 = sumP3 / 3;
	const adj6 = sumP6 / 6;
	const adj10 = sumP10 / 10;
	const adjAvg = (adj1 + adj3 + adj6 + adj10) / 4;

	return {
		adj1,
		adj3,
		adj6,
		adj10,
		adjAvg
	};
};

export const getPrices = (percentTable: PercentTable, { adjAvg }: Adjustment): PriceTable => {
	const driverPrices = Object.entries(percentTable).reduce((acc, [driver, { pAvg }]) => {
		const price = Math.round(pAvg / (adjAvg / 100));
		const bonus = bonusLookup[price] ?? 1;

		acc[driver] = {
			price,
			bonus
		};
		return acc;
	}, {}) as Record<Drivers, PriceRow>;

	const teamPrices = Object.entries(teamDrivers).reduce((acc, [team, drivers]) => {
		const price = Math.ceil(
			// we round up the average of the two drivers
			drivers.reduce((sum, driver) => {
				return sum + driverPrices[driver].price;
			}, 0) / drivers.length
		);

		acc[team] = {
			price,
			bonus: 1
		};

		return acc;
	}, {}) as Record<Teams, PriceRow>;

	return {
		...driverPrices,
		...teamPrices
	};
};

export const getDriverPredictions = (priceTable: PriceTable): DriverPredictionTable => {
	const predictionTable = {};
	// What's available price? stay tuned for Algorithm 2.
	const availablePrice = Object.entries(priceTable).reduce((sum, [key, { price }]) => {
		if (Object.values(Drivers).includes(key)) {
			return sum + price;
		}
		return sum;
	}, 0);

	// -- Cost Algorithm --
	// All points are distributed among the racers
	// according to how much they cost
	//
	// e.g.,
	// there are 114 points to be had.
	// all the racers together are worth $488
	// if Hamilton is worth $72,
	// he should win about 114 * 72 / 488 = 16.82 points
	for (const driver of Object.values(Drivers)) {
		const { price } = priceTable[driver];
		const pricePrediction = availablePoints * (price / availablePrice);
		predictionTable[driver] = pricePrediction;
	}

	return predictionTable as DriverPredictionTable;
};
export const initializeUserDriverRankings = (
	algoDriverPredictions: DriverPredictionTable
): Drivers[] => {
	const algoDriverPredictionEntries = Object.entries(algoDriverPredictions);
	const sortedAlgoDriverPredictionEntries = algoDriverPredictionEntries.sort(
		([, a], [, b]) => b - a
	);
	return sortedAlgoDriverPredictionEntries.map(([driver]) => driver) as Drivers[];
};
export const getUserDriverPredictions = (
	userDriverRankings: Drivers[],
	scoring: number[]
): DriverPredictionTable => {
	const userDriverPredictionEntries = userDriverRankings.map((driver, index) => [
		driver,
		scoring[index] ?? 0
	]);
	return Object.fromEntries(userDriverPredictionEntries);
};

export const getTeamPredictions = (
	driverPredictionTable: DriverPredictionTable
): TeamPredictionTable => {
	const teamPredictionTable = {};
	Object.entries(teamDrivers).forEach(([team, drivers]) => {
		const pricePrediction =
			drivers.reduce((sum, driver) => {
				return sum + driverPredictionTable[driver];
			}, 0) / drivers.length;

		teamPredictionTable[team] = pricePrediction;
	});
	return teamPredictionTable as TeamPredictionTable;
};

const budget = 100;
export const getPlays = (
	priceTable: PriceTable,
	algoDriverPredictionTable: DriverPredictionTable,
	algoTeamPredictionTable: TeamPredictionTable,
	userDriverPredictionTable: DriverPredictionTable,
	userTeamPredictionTable: TeamPredictionTable
): PlaysTable => {
	const algoPredictionTable = {
		...algoDriverPredictionTable,
		...algoTeamPredictionTable
	};
	const userPredictionTable = {
		...userDriverPredictionTable,
		...userTeamPredictionTable
	};
	const calculateId = (keys: Keys[]) => {
		const keyCopy = [...keys];

		keyCopy.sort((keyA, keyB) => {
			const costA = priceTable[keyA].price;
			const costB = priceTable[keyB].price;
			if (costA === costB) {
				return keyA > keyB ? 1 : -1;
			}
			return costB - costA;
		});

		return keyCopy.join(',');
	};

	const calculatePlay = (keys: Keys[]): Play | undefined => {
		const priceOfPlay = keys.reduce((acc, key) => {
			const { price } = priceTable[key];
			return acc + price;
		}, 0);

		if (priceOfPlay > budget) {
			return undefined;
		} else {
			const budgetPoints = (budget - priceOfPlay) * 0.1;
			const [algoPredictionSubtotal, userPredictionSubtotal] = keys.reduce(
				([algoAcc, userAcc], key) => {
					const algoPricePrediction = algoPredictionTable[key];
					const userPricePrediction = userPredictionTable[key];
					return [algoAcc + algoPricePrediction, userAcc + userPricePrediction];
				},
				[0, 0]
			);

			return {
				price: priceOfPlay,
				algoPredictionPoints: budgetPoints + algoPredictionSubtotal,
				userPredictionPoints: budgetPoints + userPredictionSubtotal
			};
		}
	};

	// Acceptable plays are four drivers
	// or three drivers and a team
	const DriversAndTeams = {
		...Drivers,
		...Teams
	};
	const playsById: { [id in Keys]?: Play } = {};
	for (const keyA of Object.values(DriversAndTeams)) {
		// Pick 1
		const idA = keyA;
		const playA = calculatePlay([keyA]);

		playsById[idA] = playA;

		for (const driverB of Object.values(Drivers)) {
			// Pick 2
			if (keyA === driverB) continue;

			const playAB = calculatePlay([keyA, driverB]);
			const idB = calculateId([keyA, driverB]);
			playsById[idB] = playAB;

			for (const driverC of Object.values(Drivers)) {
				// Pick 3
				if (keyA === driverC || driverB === driverC) continue;

				const playABC = calculatePlay([keyA, driverB, driverC]);
				const idC = calculateId([keyA, driverB, driverC]);

				playsById[idC] = playABC;

				for (const driverD of Object.values(Drivers)) {
					// Pick 4
					// remember, we can only pick 3 if keyA was a team and not a driver
					if (Object.keys(Teams).includes(keyA)) continue;
					if (keyA === driverD || driverB === driverD || driverC === driverD) continue;

					const playABCD = calculatePlay([keyA, driverB, driverC, driverD]);
					const idD = calculateId([keyA, driverB, driverC, driverD]);

					playsById[idD] = playABCD;
				}
			}
		}
	}

	return Object.entries(playsById)
		.filter(([, play]) => play !== undefined)
		.map(([id, play]) => ({
			keys: id.split(',') as Keys[],
			...play
		}));
};

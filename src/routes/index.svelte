<script lang="ts">
	import { races, Drivers, Teams } from '../2022';
	import {
		getPercents,
		getAdjustment,
		getPrices,
		getPredictions,
		getPlays
	} from '../utils/calculators';

	import type { Race } from '../types';

	const race = races.find(({ name }) => name === 'Australia') as Race;

	const odds = race.odds;
	const percents = getPercents(odds);
	const adjustment = getAdjustment(percents);
	const prices = getPrices(percents, adjustment);
	const predictions = getPredictions(percents, prices);
	const plays = getPlays(prices, predictions);

	let filters = {};
	$: filteredPlays = plays.filter((play) => play.keys.every((key) => !filters[key]));
</script>

<h1>Formula Fun!</h1>
<h2>Drivers</h2>
<table>
	<thead>
		<tr>
			<th>Filter</th>
			<th>Driver</th>
			<th>Price</th>
			<th>Bonus</th>
			<th>Prediction</th>
		</tr>
	</thead><tbody>
		{#each Object.values(Drivers) as driver}
			<tr>
				<td>
					<input type="checkbox" bind:checked={filters[driver]} />
				</td>
				<td>{driver}</td>
				<td>{prices[driver].price}</td>
				<td>{prices[driver].bonus}</td>
				<td>{predictions[driver].pricePrediction.toFixed(2)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<h2>Constructors</h2>
<table>
	<thead>
		<tr>
			<th>Filter</th>
			<th>Constructor</th>
			<th>Price</th>
			<th>Prediction</th>
		</tr>
	</thead><tbody>
		{#each Object.values(Teams) as team}
			<tr>
				<td>
					<input type="checkbox" bind:checked={filters[team]} />
				</td>
				<td>{team}</td>
				<td>{prices[team].price}</td>
				<td>{predictions[team].pricePrediction.toFixed(2)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<h2>Plays ({filteredPlays.length})</h2>
<table>
	<thead>
		<tr>
			<th>Pick</th>
			<th>Price</th>
			<th>Prediction</th>
		</tr>
	</thead>
	<tbody>
		{#each Object.values(filteredPlays) as play}
			<tr>
				<td>{play.keys.join(', ')}</td>
				<td>${play.price}</td>
				<td>{play.predictionPoints.toFixed(2)}</td>
			</tr>
		{/each}
	</tbody>
</table>

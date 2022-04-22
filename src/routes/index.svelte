<script lang="ts">
	import { races, Drivers, Teams, driverTeams, teamColors } from '../2022';
	import {
		getPercents,
		getAdjustment,
		getPrices,
		getPredictions,
		getPlays
	} from '../utils/calculators';

	import type { Race } from '../types';

	const race = races.find(({ name }) => name === 'Italy') as Race;

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
			<tr style="background-color:{teamColors[driverTeams[driver]]}">
				<td>
					<input type="checkbox" bind:checked={filters[driver]} />
				</td>
				<td>
					<strong>{driver}</strong>
					<br />
					<i>{driverTeams[driver]}</i>
				</td>
				<td>&euro;{prices[driver].price}</td>
				<td>&times;{prices[driver].bonus}</td>
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
			<tr style="background-color:{teamColors[team]}">
				<td>
					<input type="checkbox" bind:checked={filters[team]} />
				</td>
				<td>{team}</td>
				<td>&euro;{prices[team].price}</td>
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
				<td>
					{#each play.keys as key, index}
						{@const color = teamColors[driverTeams[key]] || teamColors[key]}
						{@const spacer = index !== play.keys.length - 1 ? ', ' : ''}
						<span style="background-color:{color}">{key}</span>{spacer}
					{/each}
				</td>
				<td>&euro;{play.price}</td>
				<td>{play.predictionPoints.toFixed(2)}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #333;
		color: white;
	}
	td {
		padding: 0.125em 0.25em;
	}
</style>

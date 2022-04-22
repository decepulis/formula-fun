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
	let searchString = '';
	$: searchArray =
		searchString !== ''
			? searchString
					.toLowerCase()
					// all non-chars to spaces
					.replace(/\W/g, ' ')
					// all chains of spaces to one space
					.replace(/ +/g, ' ')
					.trim()
					// to array
					.split(' ')
					// sort alphabetically
					.sort()
			: [];
	$: isSearchEnabled = searchString !== '';
	$: filteredPlays = plays.filter((play) => {
		const areKeysUnfiltered = play.keys.every((key) => !filters[key]);
		const areKeysInSearchArray =
			!isSearchEnabled ||
			searchArray.every((searchKey) =>
				play.keys.some((key) => key.toLowerCase().startsWith(searchKey))
			);
		return areKeysUnfiltered && areKeysInSearchArray;
	});
</script>

<main>
	<h1>Formula Fun!</h1>
	<section id="drivers">
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
	</section>

	<section id="constructors">
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
	</section>

	<section id="plays">
		<h2>Plays ({filteredPlays.length})</h2>
		<input
			type="text"
			bind:value={searchString}
			placeholder="Search Plays"
			aria-label="search"
			style="width:100%"
		/>
		<table id="plays">
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
	</section>
</main>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #182428;
		color: white;

		margin: 0;
		padding: 2em 1em;
	}

	table {
		width: 100%;
	}
	td {
		padding: 0.125em 0.25em;
	}
	input {
		border: 2px solid currentColor;
		background: none;
		padding: 0.25em;
		font: inherit;
		color: inherit;
	}

	main {
		max-width: 50em;
		margin: 0 auto;
		display: grid;
		gap: 1em;
		grid-template-columns: auto;
	}
	@media (min-width: 800px) {
		main {
			grid-template-columns: auto auto;
		}
	}
	h1,
	#plays {
		grid-column: 1 / -1;
	}
</style>

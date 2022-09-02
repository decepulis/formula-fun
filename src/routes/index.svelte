<script lang="ts">
	import { flip } from 'svelte/animate';

	import { races, Drivers, Teams, driverTeams, teamColors } from '../2022';
	import {
		getPercents,
		getAdjustment,
		getPrices,
		getDriverPredictions,
		initializeUserDriverRankings,
		getUserDriverPredictions,
		getTeamPredictions,
		getPlays
	} from '../utils/calculators';

	import type { Race } from '../types';

	const raceName = 'Netherlands';
	const race = races.find(({ name }) => name === raceName) as Race;

	const scoring = [20, 18, 16, 14, 12, 10, 8, 6, 4, 3, 2, 1];
	const odds = race.odds;
	const percents = getPercents(odds);
	const adjustment = getAdjustment(percents);
	const prices = getPrices(percents, adjustment);

	const algoDriverPredictions = getDriverPredictions(prices);
	const algoTeamPredictions = getTeamPredictions(algoDriverPredictions);

	let userDriverRankings = initializeUserDriverRankings(algoDriverPredictions);
	let userDriverPredictions = getUserDriverPredictions(userDriverRankings, scoring);
	$: userDriverPredictions = getUserDriverPredictions(userDriverRankings, scoring);
	const userTeamPredictions = getTeamPredictions(userDriverPredictions);

	const plays = getPlays(
		prices,
		algoDriverPredictions,
		algoTeamPredictions,
		userDriverPredictions,
		userTeamPredictions
	);

	// What mode are we in?
	let isUserModeChecked = true;
	$: mode = isUserModeChecked ? 'User' : 'Algo';

	// So what order are the drivers and teams in, then?
	$: driversByAlgo = Object.values(Drivers)
		.map((d) => [
			d,
			mode === 'User'
				? userDriverRankings.length - userDriverRankings.indexOf(d)
				: algoDriverPredictions[d]
		])
		.sort(([, a], [, b]) => (b as number) - (a as number))
		.map(([d]) => d);
	$: teamsByAlgo = Object.values(Teams)
		.map((t) => [t, mode === 'User' ? userTeamPredictions[t] : algoTeamPredictions[t]])
		.sort(([, a], [, b]) => (b as number) - (a as number))
		.map(([t]) => t);

	// how do we re-order the drivers?
	const promote = (driver: Drivers) => {
		const driverIndex = userDriverRankings.indexOf(driver);
		if (driverIndex <= 0) return;
		const demotedDriver = userDriverRankings[driverIndex - 1];
		userDriverRankings[driverIndex - 1] = driver;
		userDriverRankings[driverIndex] = demotedDriver;
	};
	const demote = (driver: Drivers) => {
		const driverIndex = userDriverRankings.indexOf(driver);
		if (driverIndex >= userDriverRankings.length - 1) return;
		const promotedDriver = userDriverRankings[driverIndex + 1];
		userDriverRankings[driverIndex + 1] = driver;
		userDriverRankings[driverIndex] = promotedDriver;
	};

	// What page are we on?
	let page = 0;
	let pageSize = 50;

	// What does the user wanna hide?
	let hide = {};

	// Figure out what the user is searching for
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

	// filter out hidden & searched-by plays
	$: filteredPlays = plays
		.filter((play) => {
			const areKeysUnfiltered = play.keys.every((key) => !hide[key]);
			const areKeysInSearchArray =
				!isSearchEnabled ||
				searchArray.every((searchKey) =>
					play.keys.some((key) => key.toLowerCase().startsWith(searchKey))
				);
			return areKeysUnfiltered && areKeysInSearchArray;
		})
		.sort((a, b) =>
			mode === 'Algo'
				? b.algoPredictionPoints - a.algoPredictionPoints
				: b.userPredictionPoints - a.userPredictionPoints
		);
	$: slicedPlays = filteredPlays.slice(page * pageSize, (page + 1) * pageSize);
</script>

<main>
	<h1>Formula Fun! {raceName}!</h1>
	<label class="user-mode">
		<input type="checkbox" bind:checked={isUserModeChecked} />
		User Mode
	</label>
	<section id="drivers">
		<h2>Drivers</h2>
		<table>
			<thead>
				<tr>
					<th>Hide</th>
					<th>Driver</th>
					<th>&euro;</th>
					<th>{mode}</th>
					<th>&times;</th>
					{#if mode === 'User'}
						<th />
						<th />
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each driversByAlgo as driver (driver)}
					<tr
						style="background-color:{teamColors[driverTeams[driver]]}"
						animate:flip={{ duration: 250 }}
					>
						<td>
							<input type="checkbox" bind:checked={hide[driver]} />
						</td>
						<td>
							<strong>{driver}</strong>
							<br />
							<small><i>{driverTeams[driver]}</i></small>
						</td>
						<td>&euro;{prices[driver].price}</td>
						{#if mode === 'Algo'}
							<td>{algoDriverPredictions[driver].toFixed(2)}</td>
						{:else if mode === 'User'}
							<td>{userDriverPredictions[driver]}</td>
						{/if}
						<td>&times;{prices[driver].bonus}</td>
						{#if mode === 'User'}
							<td>
								<button aria-label="Promote Driver" on:click={() => promote(driver)}>&#9650;</button
								>
							</td>
							<td>
								<button aria-label="Demote Driver" on:click={() => demote(driver)}>&#9660;</button>
							</td>
						{/if}
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
					<th>Hide</th>
					<th>Constructor</th>
					<th>Price</th>
					<th>{mode}</th>
				</tr>
			</thead><tbody>
				{#each teamsByAlgo as team}
					<tr style="background-color:{teamColors[team]}">
						<td>
							<input type="checkbox" bind:checked={hide[team]} />
						</td>
						<td>{team}</td>
						<td>&euro;{prices[team].price}</td>
						{#if mode === 'Algo'}
							<td>{algoTeamPredictions[team].toFixed(2)}</td>
						{:else if mode === 'User'}
							<td>{userTeamPredictions[team].toFixed(2)}</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<section id="plays">
		<h2>Plays ({filteredPlays.length})</h2>
		<input type="text" bind:value={searchString} placeholder="Search Plays" aria-label="search" />
		<div class="pagination">
			<button on:click={() => (page = page - 1)} disabled={page === 0}>&#9664;</button>
			Page {page + 1} of {Math.ceil(filteredPlays.length / pageSize)}
			<button
				on:click={() => (page = page + 1)}
				disabled={page === Math.ceil(filteredPlays.length / pageSize) - 1}>&#9654;</button
			>
		</div>
		<table id="plays">
			<thead>
				<tr>
					<th>Pick</th>
					<th>Price</th>
					<th>{mode}</th>
				</tr>
			</thead>
			<tbody>
				{#each Object.values(slicedPlays) as play}
					<tr>
						<td>
							{#each play.keys as key, index}
								{@const color = teamColors[driverTeams[key]] || teamColors[key]}
								{@const spacer = index !== play.keys.length - 1 ? ', ' : ''}
								<span style="background-color:{color}">{key}</span>{spacer}
							{/each}
						</td>
						<td>&euro;{play.price}</td>
						{#if mode === 'Algo'}
							<td>{play.algoPredictionPoints.toFixed(2)}</td>
						{:else if mode === 'User'}
							<td>{play.userPredictionPoints.toFixed(2)}</td>
						{/if}
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
	:global(*) {
		box-sizing: border-box;
	}

	table {
		width: 100%;
	}
	td {
		padding: 0.125em 0.25em;
	}
	input:not([type='checkbox']),
	button {
		border: 2px solid currentColor;
		background: none;
		padding: 0.25em;
		font: inherit;
		color: inherit;
		width: 100%;
	}
	button:not([disabled]) {
		cursor: pointer;
	}
	button:not([disabled]):active {
		background: white;
		color: #182428;
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
	.user-mode,
	.pagination,
	#plays {
		grid-column: 1 / -1;
	}
	.pagination {
		display: grid;
		align-items: center;
		justify-items: center;
		gap: 1rem;
		grid-template-columns: 1fr 3fr 1fr;
	}
</style>

<script lang="ts">
  import {
    adjustment,
    costTable,
    oddsTable,
    percentTable,
    playsTable,
  } from "./stores";

  let page = 1;
  let pageSize = 50;
  $: playsStart = pageSize * (page - 1);
  $: playsEnd = playsStart + pageSize;
  $: pageMax = Math.ceil($playsTable.length / pageSize);

  let sortByWeighted = true;
  $: sortByNaiveOrWeighted = (
    { naivePoints: naivePointsA, weightedPoints: weightedPointsA },
    { naivePoints: naivePointsB, weightedPoints: weightedPointsB }
  ) =>
    sortByWeighted
      ? weightedPointsA < weightedPointsB
        ? 1
        : weightedPointsA > weightedPointsB
        ? -1
        : 0
      : naivePointsA < naivePointsB
      ? 1
      : naivePointsA > naivePointsB
      ? -1
      : 0;
  $: sortedCostEntries = Object.entries(
    $costTable
  ).sort(([driverA, entryA], [driverB, entryB]) =>
    sortByNaiveOrWeighted(entryA, entryB)
  );
  $: sortedPlaysTable = $playsTable.sort(sortByNaiveOrWeighted);
</script>

<h1>Formula Fun</h1>
<div class="sort-by">
  Sort By Weighted? <input type="checkbox" bind:checked={sortByWeighted} />
</div>
<h2>Odds</h2>
<table class="odds">
  <thead>
    <th scope="col">Driver</th>
    <th scope="col" colspan="2">Top 1</th>
    <th scope="col" colspan="2">Top 3</th>
    <th scope="col" colspan="2">Top 6</th>
    <th scope="col" colspan="2">Top 10</th>
    <th scope="col">Raw Price</th>
    <th scope="col">Adjusted Price</th>
    <th scope="col">Bonus</th>
    <th scope="col">Points (Naive)</th>
    <th scope="col">Points (Weighted)</th>
  </thead>
  <tbody>
    {#each sortedCostEntries as [driver, costRow]}
      <tr>
        <th scope="row">{driver}</th>
        <td>
          <input type="number" bind:value={$oddsTable[driver].o_1} />
        </td>
        <td>{$percentTable[driver].p_1.toFixed(2)}</td>
        <td>
          <input type="number" bind:value={$oddsTable[driver].o_3} />
        </td>
        <td>{$percentTable[driver].p_3.toFixed(2)}</td>
        <td>
          <input type="number" bind:value={$oddsTable[driver].o_6} />
        </td>
        <td>{$percentTable[driver].p_6.toFixed(2)}</td>
        <td>
          <input type="number" bind:value={$oddsTable[driver].o_10} />
        </td>
        <td>{$percentTable[driver].p_10.toFixed(2)}</td>
        <td>{$percentTable[driver].p_avg.toFixed(2)}</td>
        <td>&euro;{costRow.cost}</td>
        <td>
          {costRow.bonus ? `x${costRow.bonus}` : ""}
        </td>
        <td>{costRow.naivePoints.toFixed()}</td>
        <td>{costRow.weightedPoints.toFixed(2)}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Adjustments</th>
      <td />
      <td>{$adjustment.adj_1.toFixed(2)}</td>
      <td />
      <td>{$adjustment.adj_3.toFixed(2)}</td>
      <td />
      <td>{$adjustment.adj_6.toFixed(2)}</td>
      <td />
      <td>{$adjustment.adj_10.toFixed(2)}</td>
      <td />
      <td>{$adjustment.adj_avg.toFixed(2)}</td>
      <td />
      <td />
      <td />
    </tr>
  </tfoot>
</table>

<h2>Plays</h2>

<div class="paginator">
  <button on:click={() => (page = page > 1 ? page - 1 : page)}>&larr;</button>
  <div>
    Page <input type="number" bind:value={page} min="1" max={pageMax} /> of {pageMax}
  </div>
  <button on:click={() => (page = page < pageMax ? page + 1 : page)}
    >&rarr;</button
  >
</div>
<table class="plays">
  <thead>
    <th scope="col" style="width:50%;">Drivers</th>
    <th scope="col">Cost</th>
    <th scope="col">Total Points (Naive)</th>
    <th scope="col">Total Points (Weighted)</th>
  </thead>
  <tbody>
    {#each sortedPlaysTable.slice(playsStart, playsEnd) as play}
      <tr>
        <td>{play.drivers}</td>
        <td>&euro;{play.cost}</td>
        <td>{play.naivePoints.toFixed(1)}</td>
        <td>{play.weightedPoints.toFixed(1)}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .paginator {
    display: grid;
    align-items: center;
    text-align: center;
    grid-template-columns: 1fr 1fr 1fr;
  }

  table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    border: 3px solid rgb(128, 0, 128);
  }
  tr:nth-child(even) {
    background-color: rgba(128, 0, 128, 0.15);
  }
  .odds tr:nth-child(12) {
    border-bottom: 3px solid rgb(128, 0, 128);
  }
  th,
  td {
    padding: 0.2rem;
    text-align: left;
  }
  th[scope="col"],
  tfoot td,
  tfoot th {
    background-color: rgb(128, 0, 128);
    color: white;
  }
  input {
    margin: 0;
    padding: 0;
    max-width: 100%;
  }
</style>

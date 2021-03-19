<script lang="ts">
  import {
    adjustment,
    costTable,
    oddsTable,
    percentTable,
    pointsTable,
    playsTable,
  } from "./stores";

  let page = 1;
  let pageSize = 50;
  $: playsStart = pageSize * (page - 1);
  $: playsEnd = playsStart + pageSize;
  $: pageMax = Math.ceil($playsTable.length / pageSize);

  $: drivers = Object.keys($oddsTable);
</script>

<h1>Formula Fun</h1>
<h2>Odds</h2>
<table class="odds">
  <thead>
    <th scope="col">Driver</th>
    <th scope="col">Top 1</th>
    <th scope="col">Top 3</th>
    <th scope="col">Top 6</th>
    <th scope="col">Top 10</th>
    <th scope="col">Raw Price</th>
    <th scope="col">Adjusted Price</th>
    <th scope="col">Bonus</th>
    <th scope="col">Points (Rank)</th>
    <th scope="col">Points (Cost)</th>
    <th scope="col">Points (Odds)</th>
  </thead>
  <tbody>
    {#each drivers as driver}
      <tr>
        <th scope="row">{driver}</th>
        <td>{$percentTable[driver].p1.toFixed(2)}</td>
        <td>{$percentTable[driver].p3.toFixed(2)}</td>
        <td>{$percentTable[driver].p6.toFixed(2)}</td>
        <td>{$percentTable[driver].p10.toFixed(2)}</td>
        <td>{$percentTable[driver].pAvg.toFixed(2)}</td>
        <td>&euro;{$costTable[driver].cost}</td>
        <td>
          {$costTable[driver].bonus ? `x${$costTable[driver].bonus}` : ""}
        </td>
        <td>{$pointsTable[driver].rankPoints.toFixed()}</td>
        <td>{$pointsTable[driver].costPoints.toFixed(2)}</td>
        <td>{$pointsTable[driver].oddsPoints.toFixed(2)}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Adjustments</th>
      <td>{$adjustment.adj1.toFixed(2)}</td>
      <td>{$adjustment.adj3.toFixed(2)}</td>
      <td>{$adjustment.adj6.toFixed(2)}</td>
      <td>{$adjustment.adj10.toFixed(2)}</td>
      <td />
      <td>{$adjustment.adjAvg.toFixed(2)}</td>
      <td />
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
    >&rarr;
  </button>
</div>
<table class="plays">
  <thead>
    <th scope="col" style="width:50%;">Drivers</th>
    <th scope="col">Cost</th>
    <th scope="col">Points (Rank)</th>
    <th scope="col">Points (Cost)</th>
    <th scope="col">Points (Odds)</th>
  </thead>
  <tbody>
    {#each $playsTable.slice(playsStart, playsEnd) as play}
      <tr>
        <td>{play.drivers}</td>
        <td>&euro;{play.cost}</td>
        <td>{play.rankPoints.toFixed(1)}</td>
        <td>{play.costPoints.toFixed(1)}</td>
        <td>{play.oddsPoints.toFixed(1)}</td>
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

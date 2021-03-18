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
</script>

<h2>Formula Fun</h2>
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
  </thead>
  <tbody>
    {#each Object.keys($oddsTable) as driver}
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
        <td>&euro;{$costTable[driver].cost}</td>
        <td>
          {$costTable[driver].bonus ? `x${$costTable[driver].bonus}` : ""}
        </td>
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
    </tr>
  </tfoot>
</table>

<h2>Plays</h2>

<div class="paginator">
  <button on:click={() => (page = page > 2 ? page - 1 : page)}>&larr;</button>
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
    <th scope="col">Expected Points</th>
  </thead>
  <tbody>
    {#each $playsTable.slice(playsStart, playsEnd) as play}
      <tr>
        <td>{play.drivers}</td>
        <td>&euro;{play.cost}</td>
        <td>{play.points.toFixed(1)}</td>
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
    background-color: rgba(128, 0, 128, 0.2);
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

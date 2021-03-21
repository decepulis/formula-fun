<script lang="ts">
  import App from "./App.svelte";
  import { predictionTable } from "./stores";

  import type { Row, Column } from "./types";

  export let rows: Array<Row>;
  export let columns: Array<Column>;

  export let pageSize = rows.length;
  let page = 1;
  $: pageStart = pageSize * (page - 1);
  $: pageEnd = pageStart + pageSize;
  $: pageMax = Math.ceil(rows.length / pageSize);

  let sortColumn = columns.find((column) => column.defaultSort);
  let sortOrderDescending = true;
  let toggleSort = (column: Column) => {
    if (sortColumn === column) {
      if (sortOrderDescending) {
        sortOrderDescending = false;
      } else {
        sortColumn = undefined;
      }
    } else {
      sortColumn = column;
      sortOrderDescending = true;
    }
  };

  let sortedRowSlice: Array<Row> = [...rows];
  $: {
    // duplicate
    sortedRowSlice = [...rows];
    // sort
    if (typeof sortColumn !== "undefined") {
      const { accessor } = sortColumn;
      sortedRowSlice.sort((rowA, rowB) => {
        const valueA = rowA[accessor].value ?? rowA[accessor];
        const valueB = rowB[accessor].value ?? rowB[accessor];
        return valueA < valueB
          ? sortOrderDescending
            ? 1
            : -1
          : valueA > valueB
          ? sortOrderDescending
            ? -1
            : 1
          : 0;
      });
    }
    // slice
    sortedRowSlice = sortedRowSlice.slice(pageStart, pageEnd);
  }
</script>

{#if pageSize !== rows.length}
  <div class="paginator">
    <button on:click={() => (page = page > 1 ? page - 1 : page)}>
      &larr;
    </button>
    <div>
      Page <input type="number" bind:value={page} min="1" max={pageMax} />
      of&nbsp;{pageMax}
    </div>
    <button on:click={() => (page = page < pageMax ? page + 1 : page)}>
      &rarr;
    </button>
  </div>
{/if}
<table>
  <thead>
    {#each columns as column}
      <th class="sort-header" scope="col" colspan={column.colspan ?? 1}>
        <button
          class="sort-button"
          class:descending={sortOrderDescending}
          class:active={sortColumn === column}
          on:click={() => toggleSort(column)}
        >
          {column.label}
        </button>
      </th>
    {/each}
  </thead>
  <tbody>
    {#each sortedRowSlice as row}
      <tr>
        {#each columns as { accessor, formatter, colspan, input }}
          {#if input}
            <input
              type={row[accessor].type}
              value={row[accessor].value}
              on:change={row[accessor].onChange}
            />
          {:else}
            <td colspan={colspan ?? 1}>
              {formatter ? formatter(row[accessor]) : row[accessor]}
            </td>
          {/if}
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    border: 3px solid hsl(300, 100%, 25%);
    border-top: none;
  }
  table * {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  tr:nth-child(even) {
    background-color: hsla(300, 100%, 25%, 0.15);
  }
  th,
  td {
    padding: 0.2rem;
    text-align: left;
  }
  th[scope="col"] {
    background-color: hsl(300, 100%, 25%);
    color: white;
    padding: 0;
  }
  input {
    max-width: 100%;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    margin: 0;
  }

  .paginator {
    display: grid;
    align-items: center;
    text-align: center;
    grid-template-columns: 1fr 2fr 1fr;
  }

  .sort-header {
    padding: 0;
  }
  .sort-button {
    border: none;
    padding: 0.4rem 0.2rem;
    margin: 0;
    text-decoration: none;
    background: none;
    color: inherit;
    font-size: inherit;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    width: 100%;
    text-align: inherit;

    display: grid;
    grid-template-columns: 1.5ch auto;
    gap: 0.2rem;
    align-items: center;
  }
  .sort-button:active {
    background: hsl(300, 100%, 15%);
  }
  .sort-button:before {
    content: "\25B7";
    transition: transform 0.2s ease-in-out;
  }
  .sort-button.active:before {
    transform: rotate(-90deg);
  }
  .sort-button.active.descending:before {
    transform: rotate(90deg);
  }
</style>

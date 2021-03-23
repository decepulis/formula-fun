<script lang="ts">
  import type {
    Row,
    Column,
    FormatColumn,
    ComponentColumn,
    SortableComponentColumn,
  } from "./types";

  const isComponentColumn = (column: Column): column is ComponentColumn =>
    column.hasOwnProperty("componentFn");
  const isSortableComponentColumn = (
    column: Column
  ): column is SortableComponentColumn =>
    isComponentColumn(column) && column.hasOwnProperty("sortValue");

  export let rows: Array<Row>;
  export let columns: Array<Column>;
  export let rowFilter = (row: Row) => true;

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

  let sortedFilteredRows: Array<Row> = [...rows];
  $: {
    // duplicate
    sortedFilteredRows = [...rows];
    // sort
    if (typeof sortColumn !== "undefined") {
      const { accessor } = sortColumn;
      const sortValue = isSortableComponentColumn(sortColumn)
        ? sortColumn.sortValue
        : (value) => value;
      sortedFilteredRows.sort((rowA, rowB) => {
        const valueA = sortValue(rowA[accessor]);
        const valueB = sortValue(rowB[accessor]);
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
    sortedFilteredRows = sortedFilteredRows
      // secret index key
      .map((entry, index) => ({
        ...entry,
        index,
      }))
      // rowFilter
      .filter(rowFilter);
  }

  export let pageSize = rows.length;
  let page = 1;
  $: pageStart = pageSize * (page - 1);
  $: pageEnd = pageStart + pageSize;
  $: pageMax = Math.ceil(sortedFilteredRows.length / pageSize);
  $: slicedRows = sortedFilteredRows.slice(pageStart, pageEnd);
</script>

{#if pageSize !== rows.length}
  <div class="paginator">
    <button
      on:click={() => (page = page > 1 ? page - 1 : page)}
      disabled={page <= 1}
    >
      &larr;
    </button>
    <div>
      Page <input type="number" bind:value={page} min="1" max={pageMax} />
      of&nbsp;{pageMax}
    </div>
    <button
      on:click={() => (page = page < pageMax ? page + 1 : page)}
      disabled={page >= pageMax}
    >
      &rarr;
    </button>
  </div>
{/if}
<table>
  <thead>
    {#each columns as column}
      <th class="sort-header" scope="col" colspan={column.colspan ?? 1}>
        {#if column.sortDisabled}
          {column.label}
        {:else}
          <button
            class="sort-button"
            class:descending={sortOrderDescending}
            class:active={sortColumn === column}
            on:click={() => toggleSort(column)}
          >
            {column.label}
          </button>
        {/if}
      </th>
    {/each}
  </thead>
  <tbody>
    {#each slicedRows as row}
      <tr>
        {#each columns as column}
          <td colspan={column.colspan ?? 1}>
            {#if isComponentColumn(column)}
              <svelte:component
                this={column.componentFn(row[column.accessor]).this}
                {...column.componentFn(row[column.accessor]).props}
              />
            {:else}
              {column.formatter
                ? column.formatter(row[column.accessor])
                : row[column.accessor]}
            {/if}
          </td>
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
    font-weight: normal;
  }
  th[scope="col"] {
    background-color: hsl(300, 100%, 25%);
    color: white;
    padding: 0;
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
    font-style: inherit;
    font-weight: inherit;
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

<script lang="ts">
  import { enabledTable, playsTable } from "./stores";

  import Table from "./Table.svelte";
  import type { Driver, PlaysRow } from "./types";

  const columns = [
    {
      label: "",
      accessor: "index",
      colScope: true,
      sortDisabled: true,
      formatter: (value: number) => value + 1,
    },
    {
      label: "Drivers",
      accessor: "drivers",
      formatter: (drivers: Driver[]) => drivers.join(", "),
      colScope: true,
      colspan: 6,
    },
    {
      label: "Cost",
      accessor: "cost",
      formatter: (value: number) => `€${value}`,
      colspan: 3,
    },
    {
      label: "Prediction Strat",
      accessor: "predictionPoints",
      formatter: (value: number) => value.toFixed(2),
      colspan: 3,
    },
    {
      label: "Cost Strat",
      accessor: "costPoints",
      formatter: (value: number) => value.toFixed(2),
      defaultSort: true,
      colspan: 3,
    },
    {
      label: "Odds Strat",
      accessor: "oddsPoints",
      formatter: (value: number) => value.toFixed(2),
      colspan: 3,
    },
  ];

  let searchString = "";
  $: searchArray =
    searchString !== ""
      ? searchString
          .toLowerCase()
          // all non-chars to spaces
          .replace(/\W/g, " ")
          // all chains of spaces to one space
          .replace(/ +/g, " ")
          .trim()
          // to array
          .split(" ")
          // sort alphabetically
          .sort()
      : [];

  $: rowFilter = (row: PlaysRow) => {
    const driversAreEnabled = row.drivers.every(
      (driver) => $enabledTable[driver]
    );
    const driversAreInSearchString =
      searchArray.length > 0
        ? searchArray.every((searchDriver) =>
            row.drivers.some((driver) =>
              driver.toLowerCase().startsWith(searchDriver)
            )
          )
        : true;
    return driversAreEnabled && driversAreInSearchString;
  };
</script>

<h2>Plays</h2>
<input
  type="text"
  bind:value={searchString}
  placeholder="search"
  aria-label="search"
  style="width:100%"
/>
<Table {columns} rows={$playsTable} pageSize={50} {rowFilter} />

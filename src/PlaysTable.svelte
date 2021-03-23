<script lang="ts">
  import PointsIndexCell from "./components/PointsIndexCell.svelte";

  import { enabledTable, playsTable } from "./stores";

  import Table from "./Table.svelte";
  import type { Driver, PlaysRow } from "./types";

  const columns = [
    {
      label: "Drivers",
      accessor: "drivers",
      formatter: (accessedValue: Driver[]) => accessedValue.join(", "),
      colScope: true,
      sortFirst: "ascending",
      colspan: 6,
    },
    {
      label: "Cost",
      accessor: "cost",
      formatter: (accessedValue: number) => `€${accessedValue}`,
      colspan: 3,
    },
    {
      label: "Prediction Strat",
      accessor: "predictionIndex",
      sortFirst: "ascending",
      componentFn: ({ predictionPoints, predictionIndex }: PlaysRow) => ({
        this: PointsIndexCell,
        props: {
          index: predictionIndex,
          points: predictionPoints,
        },
      }),
      colspan: 4,
    },
    {
      label: "Cost Strat",
      accessor: "costIndex",
      sortFirst: "ascending",
      componentFn: ({ costPoints, costIndex }: PlaysRow) => ({
        this: PointsIndexCell,
        props: {
          index: costIndex,
          points: costPoints,
        },
      }),
      colspan: 4,
    },
    {
      label: "Odds Strat",
      accessor: "oddsIndex",
      sortFirst: "ascending",
      componentFn: ({ oddsPoints, oddsIndex }: PlaysRow) => ({
        this: PointsIndexCell,
        props: {
          index: oddsIndex,
          points: oddsPoints,
        },
      }),
      colspan: 4,
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

<h2>Plays ({$playsTable.length})</h2>
<input
  type="text"
  bind:value={searchString}
  placeholder="Search Drivers"
  aria-label="search"
  style="width:100%"
/>
<Table {columns} rows={$playsTable} pageSize={50} {rowFilter} />

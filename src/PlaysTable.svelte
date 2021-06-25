<script lang="ts">
  import PointsScoreCell from "./components/PointsScoreCell.svelte";

  import { activeRaceIndex, enabledTables, playsTable } from "./stores";

  import Table from "./Table.svelte";
  import type { Column, Driver, PlaysRow } from "./types";

  $: enabledTable = $enabledTables[$activeRaceIndex];
  $: showFinalPoints = $playsTable.every(play => typeof play.finalPoints === 'number');

  let columns: Column[] = []
  $: columns = [
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
    !showFinalPoints ? null : {
      label: "Final Points",
      accessor: "finalPoints",
      formatter: (accessedValue: number) => accessedValue.toFixed(1),
      colspan: 3,
      defaultSort: showFinalPoints,
    },
    {
      label: "Prediction Score",
      accessor: "predictionScore",
      componentFn: ({ predictionPoints, predictionScore }: PlaysRow) => ({
        this: PointsScoreCell,
        props: {
          score: predictionScore,
          points: predictionPoints,
        },
      }),
      colspan: 4,
    },
    {
      label: "Cost Score",
      accessor: "costScore",
      componentFn: ({ costPoints, costScore }: PlaysRow) => ({
        this: PointsScoreCell,
        props: {
          score: costScore,
          points: costPoints,
        },
      }),
      colspan: 4,
    },
    {
      label: "Odds Score",
      accessor: "oddsScore",
      componentFn: ({ oddsPoints, oddsScore }: PlaysRow) => ({
        this: PointsScoreCell,
        props: {
          score: oddsScore,
          points: oddsPoints,
        },
      }),
      colspan: 4,
    },
    {
      label: "Combined Score",
      accessor: "combinedScore",
      defaultSort: !showFinalPoints,
      formatter: (accessedValue: number) => accessedValue.toFixed(2),
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
      (driver) => enabledTable[driver]
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

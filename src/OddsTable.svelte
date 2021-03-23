<script lang="ts">
  import DriverCell from "./components/DriverCell.svelte";
  import EnabledDriverCheckbox from "./components/EnabledDriverCheckbox.svelte";
  import PredictionInput from "./components/PredictionInput.svelte";

  import {
    costTable,
    pointsTable,
    oddsTable,
    enabledTable,
    predictionTable,
  } from "./stores";
  import Table from "./Table.svelte";
  import type { Column, CostRow, Driver, PointsRow } from "./types";

  $: drivers = Object.keys($oddsTable);
  interface TableRow {
    driver: string;
    cost: CostRow["cost"];
    bonus: CostRow["bonus"];
    costPoints: PointsRow["costPoints"];
    oddsPoints: PointsRow["oddsPoints"];
  }
  let rows: TableRow[] = [];
  $: rows = drivers.map((driver) => ({
    driver,
    cost: $costTable[driver].cost,
    bonus: $costTable[driver].bonus,
    costPoints: $pointsTable[driver].costPoints,
    oddsPoints: $pointsTable[driver].oddsPoints,
  }));
  const columns: Column[] = [
    {
      label: "",
      accessor: "driver",
      sortDisabled: false,
      sortValue: (accessedValue: Driver) => $enabledTable[accessedValue],
      componentFn: (row, accessedValue: Driver) => ({
        this: EnabledDriverCheckbox,
        props: { driver: accessedValue },
      }),
    },
    {
      label: "Driver",
      accessor: "driver",
      colspan: 3,
      sortFirst: "ascending",
      sortDisabled: false,
      sortValue: (accessedValue: Driver) => accessedValue,
      componentFn: (row, accessedValue: Driver) => ({
        this: DriverCell,
        props: { driver: accessedValue },
      }),
    },
    {
      label: "Cost",
      accessor: "cost",
      formatter: (accessedValue: number) => `€${accessedValue}`,
      defaultSort: true,
      colspan: 2,
    },
    {
      label: "Bonus",
      accessor: "bonus",
      formatter: (accessedValue: number) => `x${accessedValue}`,
      colspan: 2,
    },
    {
      label: "Prediction Strat",
      accessor: "driver",
      colspan: 3,
      sortDisabled: false,
      sortValue: (accessedValue: Driver) => $predictionTable[accessedValue],
      componentFn: (row, accessedValue: Driver) => ({
        this: PredictionInput,
        props: { driver: accessedValue },
      }),
    },
    {
      label: "Cost Strat",
      accessor: "costPoints",
      formatter: (accessedValue: number) => accessedValue.toFixed(2),
      colspan: 3,
    },
    {
      label: "Odds Strat",
      accessor: "oddsPoints",
      formatter: (accessedValue: number) => accessedValue.toFixed(2),
      colspan: 3,
    },
  ];
</script>

<h2>Odds</h2>
<Table bind:rows {columns} />

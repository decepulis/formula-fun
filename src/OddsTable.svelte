<script lang="ts">
  import {
    costTable,
    pointsTable,
    oddsTable,
    predictionTable,
    enabledTable,
  } from "./stores";
  import Table from "./Table.svelte";
  import type { CostRow, InputProps, PointsRow } from "./types";

  interface TableRow {
    isDriverEnabled: InputProps;
    driver: string;
    cost: CostRow["cost"];
    bonus: CostRow["bonus"];
    predictionPoints: InputProps;
    costPoints: PointsRow["costPoints"];
    oddsPoints: PointsRow["oddsPoints"];
  }
  $: drivers = Object.keys($oddsTable);
  let rows: TableRow[] = [];
  $: rows = drivers.map((driver) => ({
    isDriverEnabled: {
      type: "checkbox",
      checked: $enabledTable[driver],
      onChange: (e) => ($enabledTable[driver] = e.target.checked),
    },
    driver,
    cost: $costTable[driver].cost,
    bonus: $costTable[driver].bonus,
    predictionPoints: {
      type: "number",
      value: $predictionTable[driver],
      onChange: (e) => ($predictionTable[driver] = parseInt(e.target.value)),
    },
    costPoints: $pointsTable[driver].costPoints,
    oddsPoints: $pointsTable[driver].oddsPoints,
  }));
  const columns = [
    { label: "", accessor: "isDriverEnabled", input: true, sortDisabled: true },
    { label: "Driver", accessor: "driver", colspan: 3 },
    {
      label: "Cost",
      accessor: "cost",
      formatter: (value: number) => `€${value}`,
      defaultSort: true,
      colspan: 3,
    },
    {
      label: "Bonus",
      accessor: "bonus",
      formatter: (value: number) => `x${value}`,
      colspan: 3,
    },
    {
      label: "Prediction Strat",
      accessor: "predictionPoints",
      input: true,
      colspan: 3,
    },
    {
      label: "Cost Strat",
      accessor: "costPoints",
      formatter: (value: number) => value.toFixed(2),
      colspan: 3,
    },
    {
      label: "Odds Strat",
      accessor: "oddsPoints",
      formatter: (value: number) => value.toFixed(2),
      colspan: 3,
    },
  ];
</script>

<h2>Odds</h2>
<Table bind:rows {columns} />

<script lang="ts">
  import { costTable, pointsTable, oddsTable, predictionTable } from "./stores";
  import Table from "./Table.svelte";
  import type { CostRow, InputProps, PointsRow } from "./types";

  interface TableRow {
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
    { label: "Driver", accessor: "driver" },
    {
      label: "Cost",
      accessor: "cost",
      formatter: (value: number) => `€${value}`,
      defaultSort: true,
    },
    {
      label: "Bonus",
      accessor: "bonus",
      formatter: (value: number) => `x${value}`,
    },
    {
      label: "Prediction Strat",
      accessor: "predictionPoints",
      input: true,
    },
    {
      label: "Cost Strat",
      accessor: "costPoints",
      formatter: (value: number) => value.toFixed(2),
    },
    {
      label: "Odds Strat",
      accessor: "oddsPoints",
      formatter: (value: number) => value.toFixed(2),
    },
  ];
</script>

<h2>Odds</h2>
<Table bind:rows {columns} />

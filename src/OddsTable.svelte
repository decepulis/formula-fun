<script lang="ts">
  import { costTable, pointsTable, oddsTable } from "./stores";
  import Table from "./Table.svelte";
  import type { CostRow, PercentRow, PointsRow } from "./types";

  interface TableRow {
    driver: string;
    cost: CostRow["cost"];
    bonus: CostRow["bonus"];
    rankPoints: PointsRow["rankPoints"];
    costPoints: PointsRow["costPoints"];
    oddsPoints: PointsRow["oddsPoints"];
  }
  $: drivers = Object.keys($oddsTable);
  let rows: TableRow[] = [];
  $: rows = drivers.map((driver) => ({
    driver,
    cost: $costTable[driver].cost,
    bonus: $costTable[driver].bonus,
    rankPoints: $pointsTable[driver].rankPoints,
    costPoints: $pointsTable[driver].costPoints,
    oddsPoints: $pointsTable[driver].oddsPoints,
  }));
  const columns = [
    { label: "Driver", accessor: "driver", colScope: true },
    {
      label: "Cost",
      accessor: "cost",
      formatter: (value: number) => `€${value}`,
    },
    {
      label: "Bonus",
      accessor: "bonus",
      formatter: (value: number) => `x${value}`,
    },
    {
      label: "Rank Strat",
      accessor: "rankPoints",
      formatter: (value: number) => value.toFixed(),
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
      defaultSort: true,
    },
  ];
</script>

<h2>Odds</h2>
<Table {rows} {columns} />

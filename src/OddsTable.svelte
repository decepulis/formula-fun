<script lang="ts">
  import { costTable, percentTable, pointsTable, oddsTable } from "./stores";
  import Table from "./Table.svelte";
  import type { CostRow, Driver, PercentRow, PointsRow } from "./types";

  interface TableRow {
    driver: string;
    // p1: PercentRow["p1"];
    // p3: PercentRow["p3"];
    // p6: PercentRow["p6"];
    // p10: PercentRow["p10"];
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
    // p1: $percentTable[driver].p1,
    // p3: $percentTable[driver].p3,
    // p6: $percentTable[driver].p6,
    // p10: $percentTable[driver].p10,
    cost: $costTable[driver].cost,
    bonus: $costTable[driver].bonus,
    rankPoints: $pointsTable[driver].rankPoints,
    costPoints: $pointsTable[driver].costPoints,
    oddsPoints: $pointsTable[driver].oddsPoints,
  }));
  const columns = [
    { label: "Driver", accessor: "driver", colScope: true },
    // {
    //   label: "Top 1",
    //   accessor: "p1",
    //   formatter: (value: number) => `${value.toFixed(2)}`,
    // },
    // {
    //   label: "Top 3",
    //   accessor: "p3",
    //   formatter: (value: number) => `${value.toFixed(2)}`,
    // },
    // {
    //   label: "Top 6",
    //   accessor: "p6",
    //   formatter: (value: number) => `${value.toFixed(2)}`,
    // },
    // {
    //   label: "Top 10",
    //   accessor: "p10",
    //   formatter: (value: number) => `${value.toFixed(2)}`,
    // },
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

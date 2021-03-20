<script lang="ts">
  import { playsTable } from "./stores";

  import Table from "./Table.svelte";

  const columns = [
    { label: "Drivers", accessor: "drivers", colScope: true, colspan: 2 },
    {
      label: "Cost",
      accessor: "cost",
      formatter: (value: number) => `€${value}`,
    },
    {
      label: "Rank Strategy",
      accessor: "rankPoints",
      formatter: (value: number) => value.toFixed(2),
    },
    {
      label: "Cost Strategy",
      accessor: "costPoints",
      formatter: (value: number) => value.toFixed(2),
    },
    {
      label: "Odds Strategy",
      accessor: "oddsPoints",
      formatter: (value: number) => value.toFixed(2),
      defaultSort: true,
    },
  ];
</script>

<h2>Plays</h2>
<Table {columns} rows={$playsTable} pageSize={25} />

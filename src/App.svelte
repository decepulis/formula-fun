<script lang="ts">
  import OddsTable from "./OddsTable.svelte";
  import PlaysTable from "./PlaysTable.svelte";
</script>

<main>
  <h1>Formula Fun</h1>
  <OddsTable />
  <PlaysTable />
</main>

<style>
  main {
    padding-bottom: 1rem;
    padding-bottom: max(env(safe-area-inset-bottom), 1rem);
  }
</style>

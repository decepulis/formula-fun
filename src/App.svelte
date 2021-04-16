<script lang="ts">
  import SelectRace from "./SelectRace.svelte";
  import OddsTable from "./OddsTable.svelte";
  import PlaysTable from "./PlaysTable.svelte";
</script>

<main>
  <h1>Formula Fun</h1>
  <SelectRace />
  <OddsTable />
  <PlaysTable />
</main>

<style>
  main {
    padding-bottom: 1rem;
    padding-bottom: max(env(safe-area-inset-bottom), 1rem);
  }
</style>

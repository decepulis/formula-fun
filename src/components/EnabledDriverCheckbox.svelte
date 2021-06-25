<script lang="ts">
  import { enabledTables, activeRaceIndex } from "../stores";

  import { season } from "../season";

  import type { Driver } from "../types";
  export let driver: Driver;

  $: {
    if (!$enabledTables[$activeRaceIndex]) {
      const activeOdds = season[$activeRaceIndex].odds;
      const drivers = Object.keys(activeOdds);
      const enabledDriverEntries = drivers.map((driver) => [driver, true]);
      $enabledTables[$activeRaceIndex] = Object.fromEntries(
        enabledDriverEntries
      );
    }
  }
</script>

<input
  type="checkbox"
  bind:checked={$enabledTables[$activeRaceIndex][driver]}
/>

<style>
  input {
    max-width: 100%;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    margin: 0;
  }
</style>

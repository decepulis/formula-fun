<script lang="ts">
  import { predictionTables, activeRaceIndex, costTable } from "../stores";

  import type { Driver } from "../types";
  export let driver: Driver;

  $: {
    if (!$predictionTables[$activeRaceIndex]) {
      const costTableEntries = Object.entries($costTable);
      costTableEntries.sort(
        ([, { cost: costA }], [, { cost: costB }]) => costB - costA
      );

      const scores = [20, 18, 16, 14, 12, 10, 8, 6, 4, 3, 2, 1];
      const initialPredictionEntries = costTableEntries.map(
        ([driver], index) => [driver, scores[index] ?? 0]
      );

      $predictionTables[$activeRaceIndex] = Object.fromEntries(
        initialPredictionEntries
      );
    }
  }
</script>

<input
  type="number"
  min="0"
  bind:value={$predictionTables[$activeRaceIndex][driver]}
/>

<style>
  input {
    max-width: 100%;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    margin: 0;
  }
</style>

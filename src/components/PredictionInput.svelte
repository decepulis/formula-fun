<script lang="ts">
  import { predictionTable } from "../stores";

  import type { Driver } from "../types";
  export let driver: Driver;
</script>

<input type="number" min="0" bind:value={$predictionTable[driver]} />

<style>
  input {
    max-width: 100%;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    margin: 0;
  }
</style>

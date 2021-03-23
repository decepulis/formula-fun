<script lang="ts">
  import { enabledTable } from "../stores";

  import type { Driver } from "../types";
  export let driver: Driver;
</script>

<input type="checkbox" bind:checked={$enabledTable[driver]} />

<style>
  input {
    max-width: 100%;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    margin: 0;
  }
</style>

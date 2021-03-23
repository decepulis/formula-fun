<script lang="ts">
  import { playsTable } from "../stores";

  export let index: number;
  export let points: number;
  export let toFixed = 2;
</script>

<div><span>{index + 1}&nbsp;</span> <span>{points.toFixed(toFixed)}</span></div>

<style>
  div {
    display: grid;
    grid-template-columns: 1fr 4fr;
  }
</style>

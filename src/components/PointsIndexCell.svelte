<script lang="ts">
  import { playsTable } from "../stores";

  export let index: number;
  export let points: number;
  export let toFixed = 2;
</script>

<div>
  <span class="index">{index + 1}</span>
  <span class="points">({points.toFixed(toFixed)})</span>
</div>

<style>
  .index {
    display: inline-block;
    width: 4ch;
  }
</style>

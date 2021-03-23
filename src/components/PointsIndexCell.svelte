<script lang="ts">
  export let index: number;
  export let length: number;
  export let points: number;
  export let toFixed = 2;

  $: percentile =
    index === 0 ? "100" : (100 - (100 * index) / length).toFixed(2);
</script>

<div>
  <span class="index">{percentile}</span>
  <span class="points">({points.toFixed(toFixed)})</span>
</div>

<style>
  .index {
    display: inline-block;
    width: 5ch;
  }
</style>

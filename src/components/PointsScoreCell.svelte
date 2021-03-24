<script lang="ts">
  export let score: number;
  export let points: number;
  export let toFixed = 2;
</script>

<div>
  <span class="score">
    {score === 100 ? "100" : score === 0 ? "0" : score.toFixed(2)}
  </span>
  <span class="points">({points.toFixed(toFixed)})</span>
</div>

<style>
  .score {
    display: inline-block;
    width: 5ch;
  }
</style>

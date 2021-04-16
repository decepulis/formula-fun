<script lang="ts">
  import { season } from "./season";
  import { activeRaceIndex } from "./stores";

  import type { Race } from "./types";

  $: options = season.map(({ race }: Race, index) => ({
    value: index,
    label: race,
  }));
</script>

<select bind:value={$activeRaceIndex}>
  {#each options as { value, label }}
    <option {value}>{label}</option>
  {/each}
</select>

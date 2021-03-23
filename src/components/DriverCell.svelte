<script lang="ts">
  import { driverTeam } from "../stores";

  import type { Driver, Team } from "../types";
  export let driver: Driver;
  $: team = driverTeam[driver];
</script>

<div>{driver}<br /><span class="team">{team}</span></div>

<style>
  .team {
    font-size: 80%;
    font-style: italic;
  }
</style>

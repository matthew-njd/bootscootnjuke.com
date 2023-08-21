<script lang="ts">
    import type { Leaderboards } from '$lib/types';
    import Podium from '$lib/components/Podium.svelte';
    
    export let data:Leaderboards;

    // championship winners
    const [champFirstPlace, champSecondPlace, champThirdPlace, champFourthPlace] = data.champs

    // highest weekly points by season
    //const [hwpFirstPlace, hwpSecondPlace, hwpThirdPlace] = data.highest_week_totals
    console.log(data.highest_week_totals);

</script>

<h1 class="text-6xl text-center pt-8 pb-16">Leaderboards</h1>

<!-- Championship Winners -->
<Podium>
    <h2 slot="title" class="text-4xl text-center p-4">
        Z10s
    </h2>

    <span slot="firstPlaceName">
        {champFirstPlace.name}
    </span>
    <span slot="firstPlaceStat">
        {#each Array(champFirstPlace.titlewins) as _, index (index)}
            <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl"></iconify-icon>
        {/each}
    </span>

    <span slot="secondPlaceName">
        {champSecondPlace.name}
    </span>
    <span slot="secondPlaceStat">
        {#each Array(champSecondPlace.titlewins) as _, index (index)}
            <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl"></iconify-icon>
        {/each}
    </span>

    <span slot="thirdPlaceName">
        {champThirdPlace.name} <br>
        {champFourthPlace.name}
    </span>
    <span slot="thirdPlaceStat">
        {#each Array(champThirdPlace.titlewins) as _, index (index)}
            <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl"></iconify-icon>
        {/each}
    </span>
</Podium>

<!-- Highest Weekly Total -->
<!-- <Podium>
    <h2 slot="title" class="text-4xl text-center p-4">
        Z10s
    </h2>

    <span slot="firstPlaceName">
        {hwpFirstPlace.team}
    </span>
    <span slot="firstPlaceStat">

    </span>

    <span slot="secondPlaceName">
        {champSecondPlace.name}
    </span>
    <span slot="secondPlaceStat">

    </span>

    <span slot="thirdPlaceName">
        {champThirdPlace.name}
    </span>
    <span slot="thirdPlaceStat">

    </span>
</Podium> -->
<script lang="ts">
    import type { Leaderboards } from '$lib/types';
    import Podium from '$lib/components/Podium.svelte';
    
    export let data:Leaderboards;

    // Most championship
    const [firstPlace, secondPlace, thirdPlace, fourthPlace] = data.champs

</script>

<h1 class="text-6xl text-center pt-8 pb-16">Leaderboards</h1>

<!-- Championship Area -->
<Podium>
    <h2 slot="title" class="text-4xl text-center p-4">
        Z10s
    </h2>

    <span slot="firstPlaceName">
        {firstPlace.name}
    </span>
    <span slot="firstPlaceStat">
        {#each Array(firstPlace.titlewins) as _, index (index)}
            <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl"></iconify-icon>
        {/each}
    </span>

    <span slot="secondPlaceName">
        {secondPlace.name}
    </span>
    <span slot="secondPlaceStat">
        {#each Array(secondPlace.titlewins) as _, index (index)}
            <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl"></iconify-icon>
        {/each}
    </span>

    <span slot="thirdPlaceName">
        {thirdPlace.name} <br>
        {fourthPlace.name}
    </span>
    <span slot="thirdPlaceStat">
        {#each Array(thirdPlace.titlewins) as _, index (index)}
            <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl"></iconify-icon>
        {/each}
    </span>
</Podium>
<!-- End Championship Area -->
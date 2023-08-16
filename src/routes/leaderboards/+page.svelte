<script lang="ts">
    import type { Leaderboards } from '$lib/types';
    import Podium from '$lib/components/Podium.svelte';
    
    export let data:Leaderboards;

    // Most championship
    const [firstPlace, secondPlace, thirdPlace, fourthPlace] = data.champs

</script>

<h1 class="text-6xl text-center pt-8">Leaderboards</h1>

<!-- Championship Area -->
<Podium>
    <h2 slot="title" class="text-3xl text-center">
        Z10s
    </h2>
    <span slot="firstPlace">
        {firstPlace.name} - {firstPlace.titlewins}
    </span>
    <span slot="secondPlace">
        {secondPlace.name} - {secondPlace.titlewins}
    </span>
    <span slot="thirdPlace">
        {thirdPlace.name} - {thirdPlace.titlewins}
        <iconify-icon icon="twemoji:trophy" style="font-size: 1.1rem;"></iconify-icon> <br>
        {fourthPlace.name} - {fourthPlace.titlewins}
    </span>
</Podium>
<!-- End Championship Area -->
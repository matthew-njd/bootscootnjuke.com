<script lang="ts">
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';

    import type { Leaderboards } from '$lib/types';
    import Podium from '$lib/components/Podium.svelte';
    
    export let data:Leaderboards;

    // championship winners
    const [champFirstPlace, champSecondPlace, champThirdPlace, champFourthPlace] = data.champs

    // highest weekly points by season
    const [hwpFirstPlace, hwpSecondPlace, hwpThirdPlace] = data.highest_week_totals;
    const sourceDataWeek = data.highest_week_totals;

    const highestWeekTable: TableSource = {
	head: ['Year', 'Week', 'Team', 'Owner', 'Points'],
	body: tableMapperValues(sourceDataWeek, ['year', 'week', 'team', 'owner', 'points'])}

    // highest weekly points by season
    const [hppFirstPlace, hppSecondPlace, hppThirdPlace] = data.highest_player_totals;
    const sourceDataPlayer = data.highest_player_totals;

    const highestPlayerTable: TableSource = {
    head: ['Year', 'Week', 'Team', 'Owner', 'Player', 'Points'],
    body: tableMapperValues(sourceDataPlayer, ['year', 'week', 'team', 'owner', 'player', 'points'])}

</script>

<h1 class="text-6xl text-center pt-8 pb-16">Leaderboards</h1>

<!-- Championship Winners -->
<Podium>
    <h2 slot="title" class="text-4xl text-center p-4">
        Z10s
    </h2>

    <!--First Place-->
    <span slot="firstPlaceName">
        {champFirstPlace.name}
    </span>
    <span slot="firstPlaceStat">
        {#each Array(champFirstPlace.titlewins) as _, index (index)}
            <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl"></iconify-icon>
        {/each}
    </span>

    <!--Second Place-->
    <span slot="secondPlaceName">
        {champSecondPlace.name}
    </span>
    <span slot="secondPlaceStat">
        {#each Array(champSecondPlace.titlewins) as _, index (index)}
            <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl"></iconify-icon>
        {/each}
    </span>

    <!--Third Place-->
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

<!--Highest points by Week Per Seaon-->
<section class="pt-10">
    <Podium>
        <h2 slot="title" class="text-4xl text-center p-4">
            Highest Weekly Score per Season
        </h2>
    
        <!--First Place-->
        <span slot="firstPlaceName">
            {hwpFirstPlace.points}
        </span>
        <span slot="firstPlaceStat">
            {hwpFirstPlace.team} ({hwpFirstPlace.owner})
        </span>
        
        <!--Second Place-->
        <span slot="secondPlaceName">
            {hwpSecondPlace.points}
        </span>
        <span slot="secondPlaceStat">
            {hwpSecondPlace.team} ({hwpSecondPlace.owner})
        </span>
    
        <!--Third Place-->
        <span slot="thirdPlaceName">
            {hwpThirdPlace.points} 
        </span>
        <span slot="thirdPlaceStat">
            {hwpThirdPlace.team} ({hwpThirdPlace.owner})
        </span>
    </Podium>
    <div class="p-6">
        <Table source={highestWeekTable} />
    </div>
</section>

<!--Highest points by Player Per Seaon-->
<section class="pt-10">
    <Podium>
        <h2 slot="title" class="text-4xl text-center p-4">
            Highest Single Game Score by a Player per Season
        </h2>
    
        <!--First Place-->
        <span slot="firstPlaceName">
            {hppFirstPlace.points} by {hppFirstPlace.player}
        </span>
        <span slot="firstPlaceStat">
            {hppFirstPlace.team} ({hppFirstPlace.owner})
        </span>
    
        <!--Second Place-->
        <span slot="secondPlaceName">
            {hppSecondPlace.points} by {hppSecondPlace.player}
        </span>
        <span slot="secondPlaceStat">
            {hppSecondPlace.team} by {hppSecondPlace.owner}
        </span>
    
        <!--Third Place-->
        <span slot="thirdPlaceName">
            {hppThirdPlace.points} by {hppThirdPlace.player}
        </span>
        <span slot="thirdPlaceStat">
            {hppThirdPlace.team} ({hppThirdPlace.owner})
        </span>
    </Podium>
    <div class="p-6">
        <Table source={highestPlayerTable} />
    </div>
</section>
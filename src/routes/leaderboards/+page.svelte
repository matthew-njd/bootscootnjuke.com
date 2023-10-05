<script lang="ts">
    import type { Leaderboards } from '$lib/types';
    import Podium from '$lib/components/Podium.svelte';
    
    export let data:Leaderboards;

    // championship winners
    const [champFirstPlace, champSecondPlace, champThirdPlace, champFourthPlace] = data.champs

    // highest weekly points by season
    const [hwpFirstPlace, hwpSecondPlace, hwpThirdPlace] = data.highest_week_totals;

    // highest weekly points by season
    const [hppFirstPlace, hppSecondPlace, hppThirdPlace] = data.highest_player_totals;

    // highest team total per season
    const [hstFirstPlace, hstSecondPlace, hstThirdPlace] = data.highest_seasonal_totals;
</script>

<h1 class="flex justify-center align-baseline text-6xl pt-8 pb-16 gap-3">
    Leaderboards
    <iconify-icon icon="ion:ios-podium" style="font-size: 4rem;" title="Leaderboards" />
</h1>

<!-- Championship Winners -->
<section class="pb-[4rem]">
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
                <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl" />
            {/each}
        </span>
    
        <!--Second Place-->
        <span slot="secondPlaceName">
            {champSecondPlace.name}
        </span>
        <span slot="secondPlaceStat">
            {#each Array(champSecondPlace.titlewins) as _, index (index)}
                <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl" />
            {/each}
        </span>
    
        <!--Third Place-->
        <span slot="thirdPlaceName">
            {champThirdPlace.name}, {champFourthPlace.name}
        </span>
        <span slot="thirdPlaceStat">
            {#each Array(champThirdPlace.titlewins) as _, index (index)}
                <iconify-icon icon="twemoji:trophy" class="p-1 text-3xl" />
            {/each}
        </span>
    </Podium>
</section>

<!--Highest points by Week Per Seaon-->
<section class="pb-[4rem]">
    <Podium>
        <h2 slot="title" class="text-4xl text-center p-4">
            Highest Weekly Score per Season
        </h2>
    
        <!--First Place-->
        <span slot="firstPlaceName">
            {hwpFirstPlace.points}
        </span>
        <span slot="firstPlaceStat">
            <div class="text-gray-400">
                Team: {hwpFirstPlace.team}
            </div>
            <div class="text-gray-400">
                Owner: {hwpFirstPlace.owner}
            </div>
        </span>
        
        <!--Second Place-->
        <span slot="secondPlaceName">
            {hwpSecondPlace.points}
        </span>
        <span slot="secondPlaceStat">
            <div class="text-gray-400">
                Team: {hwpSecondPlace.team}
            </div>
            <div class="text-gray-400">
                Owner: {hwpSecondPlace.owner}
            </div>
        </span>
    
        <!--Third Place-->
        <span slot="thirdPlaceName">
            {hwpThirdPlace.points}
        </span>
        <span slot="thirdPlaceStat">
            <div class="text-gray-400">
                Team: {hwpThirdPlace.team}
            </div>
            <div class="text-gray-400">
                Owner: {hwpThirdPlace.owner}
            </div>
        </span>

        <a slot="seeMoreBtn" href="/leaderboards/{hwpFirstPlace.leaderboardId}" class="btn variant-ghost-primary mt-2" data-sveltekit-preload-data="hover">
            See more
        </a>
    </Podium>
</section>

<!--Highest points by Player Per Season-->
<section class="pb-[4rem]">
    <Podium>
        <h2 slot="title" class="text-4xl text-center p-4">
            Highest Single Game Score by a Player per Season
        </h2>
    
        <!--First Place-->
        <span slot="firstPlaceName">
            {hppFirstPlace.points} <br>
            {hppFirstPlace.player}
        </span>
        <span slot="firstPlaceStat">
            <div class="text-gray-400">
                Team: {hppFirstPlace.team}
            </div>
            <div class="text-gray-400">
                Owner: {hppFirstPlace.owner}
            </div>
        </span>
    
        <!--Second Place-->
        <span slot="secondPlaceName">
            {hppSecondPlace.points} <br>
            {hppSecondPlace.player}
        </span>
        <span slot="secondPlaceStat">
            <div class="text-gray-400">
                Team: {hppSecondPlace.team}
            </div>
            <div class="text-gray-400">
                Owner: {hppSecondPlace.owner}
            </div>
        </span>
    
        <!--Third Place-->
        <span slot="thirdPlaceName">
            {hppThirdPlace.points} <br>
            {hppThirdPlace.player}
        </span>
        <span slot="thirdPlaceStat">
            <div class="text-gray-400">
                Team: {hppThirdPlace.team}
            </div>
            <div class="text-gray-400">
                Owner: {hppThirdPlace.owner}
            </div>
        </span>

        <a slot="seeMoreBtn" href="/leaderboards/{hppFirstPlace.leaderboardId}" class="btn variant-ghost-primary mt-2" data-sveltekit-preload-data="hover">
            See more
        </a>
    </Podium>
</section>

<!--Highest points by Team Per Seaon-->
<section class="pb-[4rem]">
    <Podium>
        <h2 slot="title" class="text-4xl text-center p-4">
            Highest Seasonal Total
        </h2>
    
        <!--First Place-->
        <span slot="firstPlaceName">
            {hstFirstPlace.points}
        </span>
        <span slot="firstPlaceStat">
            <div class="text-gray-400">
                Team: {hstFirstPlace.team}
            </div>
            <div class="text-gray-400">
                Owner: {hstFirstPlace.owner}
            </div>
        </span>
    
        <!--Second Place-->
        <span slot="secondPlaceName">
            {hstSecondPlace.points}
        </span>
        <span slot="secondPlaceStat">
            <div class="text-gray-400">
                Team: {hstSecondPlace.team}
            </div>
            <div class="text-gray-400">
                Owner: {hstSecondPlace.owner}
            </div>
        </span>
    
        <!--Third Place-->
        <span slot="thirdPlaceName">
            {hstThirdPlace.points}
        </span>
        <span slot="thirdPlaceStat">
            <div class="text-gray-400">
                Team: {hstThirdPlace.team}
            </div>
            <div class="text-gray-400">
                Owner: {hstThirdPlace.owner}
            </div>
        </span>

        <a slot="seeMoreBtn" href="/leaderboards/{hstFirstPlace.leaderboardId}" class="btn variant-ghost-primary mt-2" data-sveltekit-preload-data="hover">
            See more
        </a>
    </Podium>
</section>

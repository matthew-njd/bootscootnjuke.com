<script lang="ts">
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';

    export let data

    let [ category ] = data.leadboard_category
    
    const sourceData = data.leadboard_category;
    
    const highestWeekTable: TableSource = {
	head: ['Year', 'Week', 'Team', 'Owner', 'Points'],
	body: tableMapperValues(sourceData, ['year', 'week', 'team', 'owner', 'points'])}

    const highestPlayerTable: TableSource = {
    head: ['Year', 'Week', 'Team', 'Owner', 'Player', 'Points'],
    body: tableMapperValues(sourceData, ['year', 'week', 'team', 'owner', 'player', 'points'])}

    const highestSeasonTable: TableSource = {
    head: ['Year', 'Team', 'Owner', 'Points'],
    body: tableMapperValues(sourceData, ['year', 'team', 'owner', 'points'])}
</script>

<div class="p-6">
    {#if category.leaderboardId === "highest_week_totals"}
        <h1 class="text-6xl text-center mb-4">Highest Weekly Score per Season</h1>
        <Table source={highestWeekTable} />
    {:else if category.leaderboardId === "highest_player_totals"}
        <h1 class="text-6xl text-center mb-4">Highest Single Game Score by a Player per Season</h1>
        <Table source={highestPlayerTable} />
    {:else if category.leaderboardId === "highest_season_totals"}
        <h1 class="text-6xl text-center mb-4">Highest Seasonal Total</h1>
        <Table source={highestSeasonTable} />
    {/if}
</div>
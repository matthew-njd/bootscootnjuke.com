<script lang="ts">
    import { Avatar, Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';

    export let data;

    const initials = data.owner.name;
    const logo = data.owner.logoUrl;
    const sourceData = data.team_stats;

    // suming each column and getting the average to two decimal places.
    const sumWins = data.team_stats.reduce((acc: number, obj: { wins: number; }) => acc + obj.wins, 0);
    const avgWins = Math.round(sumWins / data.team_stats.length * 100) / 100;

    const sumLoses = data.team_stats.reduce((acc: number, obj: { loses: number; }) => acc + obj.loses, 0);
    const avgLoses = Math.round(sumLoses / data.team_stats.length * 100) / 100;
    
    const sumPtsFor = data.team_stats.reduce((acc: number, obj: { ptsFor: number; }) => acc + obj.ptsFor, 0);
    const avgPtsFor = Math.round(sumPtsFor / data.team_stats.length * 100) / 100;

    const sumPtsAgst = data.team_stats.reduce((acc: number, obj: { ptsAgst: number; }) => acc + obj.ptsAgst, 0);
    const avgPtsAgst = Math.round(sumPtsAgst / data.team_stats.length * 100) / 100;

    const sumFinalPlace = data.team_stats.reduce((acc: number, obj: { finalPlace: number; }) => acc + obj.finalPlace, 0);
    const avgFinalPlace = Math.round(sumFinalPlace / data.team_stats.length * 100) / 100;

    const teamStatsTable: TableSource = {
	head: ['Year', 'Team Name', 'Wins', 'Loses', 'Points For', 'Points Against', 'Final Place'],
	body: tableMapperValues(sourceData, ['year', 'team', 'wins', 'loses', 'ptsFor', 'ptsAgst', 'finalPlace']),
	foot: ['Average', '', `${avgWins}`, `${avgLoses}`, `${avgPtsFor}`, `${avgPtsAgst}`, `${avgFinalPlace}`]
};
</script>

<div class="p-6">
    <div class="flex justify-center text-center gap-4 pb-4">
        <Avatar initials={initials} src={logo} width="w-[80px]" rounded="rounded-lg" />
        <h1 class="text-6xl mb-4">{data.owner.name}</h1>
    </div>
    <Table source={teamStatsTable} class="table-hover" />
</div>
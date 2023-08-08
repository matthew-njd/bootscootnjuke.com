<script lang="ts">
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';

    export let data;
    
    console.log(data.seasons);

    const sourceData = data.seasons;

    const sumWins = data.seasons.reduce((acc: number, obj: { wins: number; }) => acc + obj.wins, 0);
    const avgWins = sumWins / data.seasons.length;

    const sumLoses = data.seasons.reduce((acc: number, obj: { loses: number; }) => acc + obj.loses, 0);
    const avgLoses = Math.round(sumLoses / data.seasons.length * 100) / 100;
    
    const sumPtsFor = data.seasons.reduce((acc: number, obj: { ptsFor: number; }) => acc + obj.ptsFor, 0);
    const avgPtsFor = Math.round(sumPtsFor / data.seasons.length * 100) / 100;

    const sumPtsAgst = data.seasons.reduce((acc: number, obj: { ptsAgst: number; }) => acc + obj.ptsAgst, 0);
    const avgPtsAgst = Math.round(sumPtsAgst / data.seasons.length * 100) / 100;

    const sumFinalPlace = data.seasons.reduce((acc: number, obj: { finalPlace: number; }) => acc + obj.finalPlace, 0);
    const avgFinalPlace = Math.round(sumFinalPlace / data.seasons.length * 100) / 100;

    const tableSimple: TableSource = {
	head: ['Year', 'Team Name', 'Wins', 'Loses', 'Points For', 'Points Against', 'Final Place'],
	body: tableMapperValues(sourceData, ['year', 'team', 'wins', 'loses', 'ptsFor', 'ptsAgst', 'finalPlace']),
	foot: ['Average', '', `${avgWins}`, `${avgLoses}`, `${avgPtsFor}`, `${avgPtsAgst}`, `${avgFinalPlace}`]
};
</script>

<div class="p-6">
    <h1 class="text-6xl text-center mb-4">{data.owner.name}</h1>
    <Table source={tableSimple} />
</div>
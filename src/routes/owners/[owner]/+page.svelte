<script lang="ts">
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';

    export let data;

    const sourceData = data.seasons.reverse();

    const sumWins = data.seasons.reduce((acc, obj) => acc + obj.wins, 0);
    const avgWins = sumWins / data.seasons.length;

    const sumLoses = data.seasons.reduce((acc, obj) => acc + obj.loses, 0);
    const avgLoses = sumLoses / data.seasons.length;
    
    const sumPtsFor = data.seasons.reduce((acc, obj) => acc + obj.ptsFor, 0);
    const avgPtsFor = sumPtsFor / data.seasons.length;

    const sumPtsAgst = data.seasons.reduce((acc, obj) => acc + obj.ptsAgst, 0);
    const avgPtsAgst = sumPtsAgst / data.seasons.length;

    const sumFinalPlace = data.seasons.reduce((acc, obj) => acc + obj.finalPlace, 0);
    const avgFinalPlace = sumFinalPlace / data.seasons.length;

    const tableSimple: TableSource = {
	head: ['Year', 'Team Name', 'Wins', 'Loses', 'Points For', 'Points Against', 'Final Place'],
	body: tableMapperValues(sourceData, ['year', 'team', 'wins', 'loses', 'ptsFor', 'ptsAgst', 'finalPlace']),
	foot: ['Average', '', `${Math.round(avgWins * 100) / 100}`, `${Math.round(avgLoses * 100) / 100}`, `${Math.round(avgPtsFor * 100) / 100}`, 
        `${Math.round(avgPtsAgst * 100) / 100}`, `${Math.round(avgFinalPlace * 100) / 100}`]
};
</script>

<div class="p-6">
    <h1 class="text-6xl text-center mb-4">{data.owner.name}</h1>
    <Table source={tableSimple} />
</div>
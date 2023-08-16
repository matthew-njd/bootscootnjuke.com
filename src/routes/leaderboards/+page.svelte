<script lang="ts">
    import type { Leaderboards } from '$lib/types';
    import { Avatar } from '@skeletonlabs/skeleton';
    
    export let data:Leaderboards;

    const firstPlaceImage = "/images/first_medal.png"
    const secondPlaceImage = "/images/second_medal.png"
    const thirdPlaceImage = "/images/third_medal.png"

    const champions = data.champs

</script>

<h1 class="text-4xl text-center">Leaderboards</h1>
<h2 class="text-center">Most Championships</h2>
<div class="flex justify-center pt-8">
    <div class="pt-[75px] pr-2">
        <div class="card card-hover w-[300px]">
            <header class="flex justify-center card-header">
                <Avatar src={secondPlaceImage} width="w-20" rounded="rounded-md" background="none" />
            </header>
            <section class="p-4">(content)</section>
            <footer class="card-footer">(footer)</footer>
        </div>
    </div>
    <div class="">
        <div class="card card-hover w-[300px]">
            <header class="flex justify-center card-header">
                <Avatar src={firstPlaceImage} width="w-20" rounded="rounded-md" background="none" />
            </header>
            <section class="p-4">(content)</section>
            <footer class="card-footer">(footer)</footer>
        </div>
    </div>
    <div class="pt-[125px] pl-2">
        <div class="card card-hover w-[300px]">
            <header class="flex justify-center card-header">
                <Avatar src={thirdPlaceImage} width="w-20" rounded="rounded-md" background="none" />
            </header>
            <section class="p-4">(content)</section>
            <footer class="card-footer">(footer)</footer>
        </div>
    </div>
</div>

<script lang="ts">
    import type { Leaderboards } from '$lib/types';
    import { Avatar } from '@skeletonlabs/skeleton';
    
    const first = "/images/first_medal.png"
    const second = "/images/second_medal.png"
    const third = "/images/third_medal.png"

    export let data: Leaderboards;
    console.log(data.stats);
</script>

<h1 class="text-4xl text-center">Leaderboards</h1>
<div class="flex justify-center pt-8">
    <div class="pt-[75px] pr-2">
        <div class="card card-hover w-[300px]">
            <header class="flex justify-center card-header">
                <Avatar src={second} width="w-20" rounded="rounded-md" background="none" />
            </header>
            <section class="p-4">(content)</section>
            <footer class="card-footer">(footer)</footer>
        </div>
    </div>
    <div class="">
        <div class="card card-hover w-[300px]">
            <header class="flex justify-center card-header">
                <Avatar src={first} width="w-20" rounded="rounded-md" background="none" />
            </header>
            <section class="p-4">(content)</section>
            <footer class="card-footer">(footer)</footer>
        </div>
    </div>
    <div class="pt-[125px] pl-2">
        <div class="card card-hover w-[300px]">
            <header class="flex justify-center card-header">
                <Avatar src={third} width="w-20" rounded="rounded-md" background="none" />
            </header>
            <section class="p-4">(content)</section>
            <footer class="card-footer">(footer)</footer>
        </div>
    </div>
</div>

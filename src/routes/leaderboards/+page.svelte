<script lang="ts">
    import type { Leaderboards } from '$lib/types';
    import { Avatar } from '@skeletonlabs/skeleton';
    
    export let data:Leaderboards;

    const firstPlaceImage = "/images/first_medal.png"
    const secondPlaceImage = "/images/second_medal.png"
    const thirdPlaceImage = "/images/third_medal.png"

    // Most championship
    const [firstPlace, secondPlace, thirdPlace, fourthPlace] = data.champs

</script>

<h1 class="text-6xl text-center pt-8">Leaderboards</h1>
<div class="pt-[100px]">
    <h2 class="text-3xl text-center">Most Z10s</h2>
    <div class="flex justify-center pt-8">
        <div class="align-baseline pr-2">
            <div class="card card-hover w-[300px]">
                <header class="flex justify-center card-header">
                    <Avatar src={secondPlaceImage} width="w-20" rounded="rounded-md" background="none" />
                </header>
                <section class="text-2xl text-center p-4">
                    {secondPlace.name} - {secondPlace.titlewins}<iconify-icon icon="twemoji:trophy" style="font-size: 1.1rem;"></iconify-icon>
                </section>
            </div>
        </div>
        <div class="align-baseline">
            <div class="card card-hover w-[300px]">
                <header class="flex justify-center card-header">
                    <Avatar src={firstPlaceImage} width="w-20" rounded="rounded-md" background="none" />
                </header>
                <section class="text-2xl text-center p-4">
                    {firstPlace.name} - {firstPlace.titlewins}<iconify-icon icon="twemoji:trophy" style="font-size: 1.1rem;"></iconify-icon>
                </section>
            </div>
        </div>
        <div class="align-baseline pl-2">
            <div class="card card-hover w-[300px]">
                <header class="flex justify-center card-header">
                    <Avatar src={thirdPlaceImage} width="w-20" rounded="rounded-md" background="none" />
                </header>
                <section class="text-2xl text-center p-4">
                    {fourthPlace.name} - {fourthPlace.titlewins}<iconify-icon icon="twemoji:trophy" style="font-size: 1.1rem;"></iconify-icon> <br>
                    {thirdPlace.name} - {thirdPlace.titlewins}<iconify-icon icon="twemoji:trophy" style="font-size: 1.1rem;"></iconify-icon>
                </section>
            </div>
        </div>
    </div>
</div>
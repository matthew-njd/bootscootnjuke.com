<script lang="ts">
    import DraftCard from "$lib/components/DraftCard.svelte";
import type { Drafts } from "$lib/types"

    export let data:Drafts;

    const firstRound = data.draft.slice(0,10);
</script>

<h1 class="flex justify-center align-baseline text-6xl pt-8 pb-16 gap-3">
    Draft History
    <iconify-icon icon="ri:draft-fill" style="font-size: 4rem;" title="Drafts" />
</h1>

<div class="flex">
    {#each firstRound as { player, playerHeadshotUrl, team }}
        <DraftCard>
            <span slot="player">
                <img src={playerHeadshotUrl} alt="Player Headshot" class="w-[150px] rounded-full"/>
                {player}
            </span>
            <span slot="team">
                {team}
            </span>
        </DraftCard>
    {/each}
</div>
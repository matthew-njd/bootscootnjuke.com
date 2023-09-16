<script lang="ts">
    import DraftCard from "$lib/components/DraftCard.svelte";
    import { Tab, TabGroup } from "@skeletonlabs/skeleton";
    import type { Drafts } from "$lib/types"

    import DraftTabStore from "../../store";

    export let data:Drafts;

    const firstRound = data.draft.slice(0,10);
    const secondRound = data.draft.slice(10,20);
    const thirdRound = data.draft.slice(20,30);
    const fourthRound = data.draft.slice(30,40);
    const fifthRound = data.draft.slice(40,50);
    const sixthRound = data.draft.slice(50,60);
    const seventhRound = data.draft.slice(60,70);
    const eigthRound = data.draft.slice(70,80);
    const ninthRound = data.draft.slice(80,90);
    const tenthRound = data.draft.slice(90,100);
    const eleventhRound = data.draft.slice(100,110);
    const twelfthRound = data.draft.slice(110,120);
    const thirteenthRound = data.draft.slice(120,130);
    const fourteenthRound = data.draft.slice(130,140);
    const fifteenthRound = data.draft.slice(140,150);

    let tabSet: number = 0;

    //function to set the store value of the clicked tab (draftId) 
    function draftTab(draftId:string) {
        DraftTabStore.set(draftId)
    }

    DraftTabStore.subscribe((data) => {
        console.log(data);
    })
</script>

<h1 class="flex justify-center align-baseline text-6xl pt-8 pb-16 gap-3">
    Draft History
    <iconify-icon icon="ri:draft-fill" style="font-size: 4rem;" title="Drafts" />
</h1>

<TabGroup justify="justify-center">
    <Tab bind:group={tabSet} on:click={() => draftTab("draft_2023")} name="tab1" value={0}>
		2023 Draft
	</Tab>
	<Tab bind:group={tabSet} on:click={() => draftTab("draft_2022")} name="tab2" value={1}>
        2022 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => draftTab("draft_2021")} name="tab2" value={2}>
        2021 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => draftTab("draft_2020")} name="tab2" value={3}>
        2020 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => draftTab("draft_2019")} name="tab2" value={4}>
        2019 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => draftTab("draft_2018")} name="tab2" value={5}>
        2018 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => draftTab("draft_2017")} name="tab2" value={6}>
        2017 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => draftTab("draft_2016")} name="tab2" value={7}>
        2016 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => draftTab("draft_2015")} name="tab2" value={8}>
        2015 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => draftTab("draft_2014")} name="tab2" value={9}>
        2014 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => draftTab("draft_2013")} name="tab2" value={10}>
        2013 Draft
    </Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
        {#if tabSet === 0}
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 1
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each firstRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 2
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each secondRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 3
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each thirdRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 4
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each fourthRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 5
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each fifthRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 6
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each sixthRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 7
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each seventhRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 8
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each eigthRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 9
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each ninthRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 10
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each tenthRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 11
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each eleventhRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 12
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each twelfthRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 13
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each thirteenthRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 14
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each fourteenthRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>
        
        <section>
            <h2 class="text-4xl text-center p-4">
                Round 15
            </h2>
            <div class="flex justify-center flex-wrap">
                {#each fifteenthRound as { player, playerHeadshotUrl, team, pick }}
                    <DraftCard>
                        <span slot="header">
                            {pick?.toFixed(2)}
                        </span>
                        <span slot="section">
                            <img src={playerHeadshotUrl} alt="Player Headshot" class="rounded-full"/>
                            {player}
                        </span>
                        <span slot="footer">
                            {team}
                        </span>
                    </DraftCard>
                {/each}
            </div>
        </section>        
        {/if}
	</svelte:fragment>
</TabGroup>
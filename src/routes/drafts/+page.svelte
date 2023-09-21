<script lang="ts">
    import DraftCard from "$lib/components/DraftCard.svelte";
    import { Tab, TabGroup } from "@skeletonlabs/skeleton";
    import type { Drafts } from "$lib/types"

    export let data:Drafts;

    let tabSet: number = 0;

    //This is the default draft data. Set to the most recent draft year
    let firstRound = data.draft.filter(picks => picks.pick >= 1.01 && picks.pick <= 1.10 && picks.year === 2023);
    let secondRound = data.draft.filter(picks => picks.pick >= 2.01 && picks.pick <= 2.10 && picks.year === 2023);
    let thirdRound = data.draft.filter(picks => picks.pick >= 3.01 && picks.pick <= 3.10 && picks.year === 2023);
    let fourthRound = data.draft.filter(picks => picks.pick >= 4.01 && picks.pick <= 4.10 && picks.year === 2023);
    let fifthRound = data.draft.filter(picks => picks.pick >= 5.01 && picks.pick <= 5.10 && picks.year === 2023);
    let sixthRound = data.draft.filter(picks => picks.pick >= 6.01 && picks.pick <= 6.10 && picks.year === 2023);
    let seventhRound = data.draft.filter(picks => picks.pick >= 7.01 && picks.pick <= 7.10 && picks.year === 2023);
    let eigthRound = data.draft.filter(picks => picks.pick >= 8.01 && picks.pick <= 8.10 && picks.year === 2023);
    let ninthRound = data.draft.filter(picks => picks.pick >= 9.01 && picks.pick <= 9.10 && picks.year === 2023);
    let tenthRound = data.draft.filter(picks => picks.pick >= 10.01 && picks.pick <= 10.10 && picks.year === 2023);
    let eleventhRound = data.draft.filter(picks => picks.pick >= 11.01 && picks.pick <= 11.10 && picks.year === 2023);
    let twelfthRound = data.draft.filter(picks => picks.pick >= 12.01 && picks.pick <= 12.10 && picks.year === 2023);
    let thirteenthRound = data.draft.filter(picks => picks.pick >= 13.01 && picks.pick <= 13.10 && picks.year === 2023);
    let fourteenthRound = data.draft.filter(picks => picks.pick >= 14.01 && picks.pick <= 14.10 && picks.year === 2023);
    let fifteenthRound = data.draft.filter(picks => picks.pick >= 15.01 && picks.pick <= 15.10 && picks.year === 2023);

    //function for reactive assignments
    function filterDraftData(draftId: string) {
        const draftData = data.draft.filter(draftYear => draftYear.draftId === draftId);

        firstRound = draftData.filter(picks => picks.pick >= 1.01 && picks.pick <= 1.10);
        secondRound = draftData.filter(picks => picks.pick >= 2.01 && picks.pick <= 2.10);
        thirdRound = draftData.filter(picks => picks.pick >= 3.01 && picks.pick <= 3.10);
        fourthRound = draftData.filter(picks => picks.pick >= 4.01 && picks.pick <= 4.10);
        fifthRound = draftData.filter(picks => picks.pick >= 5.01 && picks.pick <= 5.10);
        sixthRound = draftData.filter(picks => picks.pick >= 6.01 && picks.pick <= 6.10);
        seventhRound = draftData.filter(picks => picks.pick >= 7.01 && picks.pick <= 7.10);
        eigthRound = draftData.filter(picks => picks.pick >= 8.01 && picks.pick <= 8.10);
        ninthRound = draftData.filter(picks => picks.pick >= 9.01 && picks.pick <= 9.10);
        tenthRound = draftData.filter(picks => picks.pick >= 10.01 && picks.pick <= 10.10);
        eleventhRound = draftData.filter(picks => picks.pick >= 11.01 && picks.pick <= 11.10);
        twelfthRound = draftData.filter(picks => picks.pick >= 12.01 && picks.pick <= 12.10);
        thirteenthRound = draftData.filter(picks => picks.pick >= 13.01 && picks.pick <= 13.10);
        fourteenthRound = draftData.filter(picks => picks.pick >= 14.01 && picks.pick <= 14.10);
        fifteenthRound = draftData.filter(picks => picks.pick >= 15.01 && picks.pick <= 15.10);
    }
</script>

<h1 class="flex justify-center align-baseline text-6xl pt-8 pb-16 gap-3">
    Draft History
    <iconify-icon icon="ri:draft-fill" style="font-size: 4rem;" title="Drafts" />
</h1>

<TabGroup justify="justify-center">
    <Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2023")} name="tab2023" value={0}>
		2023 Draft
	</Tab>
	<Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2022")} name="tab2022" value={1}>
        2022 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2021")} name="tab2021" value={2}>
        2021 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2020")} name="tab2020" value={3}>
        2020 Draft
    </Tab>
    <!-- <Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2019")} name="tab2019" value={4}>
        2019 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2018")} name="tab2018" value={5}>
        2018 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2017")} name="tab2017" value={6}>
        2017 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2016")} name="tab2016" value={7}>
        2016 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2015")} name="tab2015" value={8}>
        2015 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2014")} name="tab2014" value={9}>
        2014 Draft
    </Tab>
    <Tab bind:group={tabSet} on:click={() => filterDraftData("draft_2013")} name="tab2013" value={10}>
        2013 Draft
    </Tab> -->
    
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
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
	</svelte:fragment>
</TabGroup>
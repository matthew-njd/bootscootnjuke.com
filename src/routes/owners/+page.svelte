<script lang="ts">
    import { Avatar } from "@skeletonlabs/skeleton";
    import type { Owners } from "$lib/types"

    export let data: Owners;
</script>

<div class="">
    <div class="py-8">
        <h1 class="flex justify-center align-baseline text-6xl pb-16 gap-3">
            Owners
            <iconify-icon icon="mdi:account-group" style="font-size: 4rem;" title="Team owners" />
        </h1>

        {#each data.owner as {ownerId, name, active, bio, logoUrl}}
                {#if active === true}
                    <a href="/owners/{ownerId}" class="block card card-hover m-4">
                        <header class="card-header flex items-center gap-4">
                            <Avatar initials={name} src={logoUrl} width="w-[80px]" rounded="rounded-lg" />
                            <h2 class="text-3xl">{name}</h2>
                        </header>
	                    <section class="p-4">{bio}</section>
                        <footer class="card-footer justify-end flex items-center">
                            <h3 class="text-lg text-[#EA861A]">Stats</h3>
                            <iconify-icon icon="mdi:arrow-right" style="font-size: 1.8rem; color:rgb(234 134 26)"></iconify-icon>
                        </footer>
                    </a>
                {/if}
        {/each}
    </div>
    <div class="py-8">
        <h1 class="text-3xl text-center">Retired Owners</h1>
        {#each data.owner as {ownerId, name, active, bio}}
                {#if active === false}
                    <a href="/owners/{ownerId}" class="block card card-hover m-4">
                        <header class="card-header"><h2 class="text-xl">{name}</h2></header>
	                    <section class="p-4">{bio}</section>
                        <footer class="card-footer justify-end flex items-center">
                            <h3 class="text-lg text-[#EA861A]">Stats</h3>
                            <iconify-icon icon="mdi:arrow-right" style="font-size: 1.8rem; color:rgb(234 134 26)"></iconify-icon>
                        </footer>
                    </a>
                {/if}
        {/each}
    </div>
</div>
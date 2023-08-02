<script lang="ts">
    export let data;
</script>

<div class="">
    <div class="py-8">
        <h1 class="text-4xl text-center">Boot Scoot n Juke Owners</h1>
        {#each data.owners as {id, name, active, bio}}
                {#if active === true}
                    <a href="/owners/{id}" class="block card card-hover m-4">
                        <header class="card-header"><h2 class="text-xl">{name}</h2></header>
	                    <section class="p-4">Bio: {bio}</section>
                        <footer class="card-footer">
                            <iconify-icon icon="mdi:arrow-right" style="font-size: 2rem;"></iconify-icon>
                        </footer>
                    </a>
                {/if}
        {/each}
    </div>
    <div class="py-8">
        <h1 class="text-3xl text-center">Retired Owners</h1>
        {#each data.owners as {id, name, active, bio}}
                {#if active === false}
                    <a href="/owners/{id}" class="block card card-hover m-4">
                        <header class="card-header"><h2 class="text-xl">{name}</h2></header>
	                    <section class="p-4">Bio: {bio}</section>
                        <footer class="card-footer">
                            <iconify-icon icon="mdi:arrow-right" style="font-size: 2rem;"></iconify-icon>
                        </footer>
                    </a>
                {/if}
        {/each}
    </div>
</div>
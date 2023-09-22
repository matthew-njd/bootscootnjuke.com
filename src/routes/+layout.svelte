<script lang="ts">
    import "../app.css";
    import 'iconify-icon'

    import '@skeletonlabs/skeleton/themes/theme-vintage.css';
    import '@skeletonlabs/skeleton/styles/skeleton.css';

    import { AppShell } from '@skeletonlabs/skeleton';
    import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
    
    import { page } from '$app/stores';
    import { afterNavigate } from "$app/navigation";

    import Navigation from "$lib/components/Navigation.svelte"

    //scroll to top when route changes
    afterNavigate((params: any) => {
        const isNewPage: boolean = params.from && params.to && params.from.route.id !== params.to.route.id;
        const elemPage = document.querySelector('#page');
        if (isNewPage && elemPage !== null) {
            elemPage.scrollTop = 0;
        }
    });

    //open nav drawer
    function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<Drawer width="w-auto">
    <Navigation />
</Drawer>

<AppShell scrollGutter="auto" slotSidebarLeft="w-0 lg:w-auto">
    <svelte:fragment slot="header">
        <div class="flex justify-between lg:hidden m-3">
            <button class="h-auto" on:click={drawerOpen}>
                <iconify-icon icon="pajamas:hamburger" style="font-size: 2rem;" title="Navigation" />
            </button>
            <a href="/" class="font-bold text-[1.5rem]">🥾🛴n'🏈</a>
        </div>
    </svelte:fragment>

	<svelte:fragment slot="sidebarLeft">
        <Navigation />
    </svelte:fragment>
    
	<slot />

	<svelte:fragment slot="pageFooter">
        <section class="grid place-content-center h-20">
            <h2>Boot Scoot n Juke<iconify-icon icon="mdi:trademark" class="" /></h2>
        </section>
    </svelte:fragment>
</AppShell>
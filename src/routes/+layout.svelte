<script lang="ts">
    import "../app.css";
    import 'iconify-icon'

    import '@skeletonlabs/skeleton/themes/theme-vintage.css';
    import '@skeletonlabs/skeleton/styles/skeleton.css';
    
    import type { ComponentEvents } from 'svelte';

    import { AppShell } from '@skeletonlabs/skeleton';
    import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
    import { page } from '$app/stores';

    function scrollHandler(event: ComponentEvents<AppShell>['scroll']) {
        console.log(event.currentTarget.scrollTop);
    }
</script>


<AppShell on:scroll={scrollHandler}>
    <!-- slotSidebarLeft="w-0 lg:w-auto"
    <svelte:fragment slot="header">
        <div class="flex items-center">
            <button class="lg:hidden btn btn-sm mr-4">
                <iconify-icon icon="quill:hamburger-sidebar" style="font-size: 2rem;" title="Menu" />
            </button>
        </div>
    </svelte:fragment> -->
	<svelte:fragment slot="sidebarLeft">       
        <AppRail>
            <AppRailAnchor href="/" selected={$page.url.pathname === '/'}>
                <iconify-icon icon="mdi:home" style="font-size: 3rem;" title="Home" />
            </AppRailAnchor>
	        <AppRailAnchor href="/owners" selected={$page.url.pathname === '/owners'}>
                <iconify-icon icon="mdi:account-group" style="font-size: 3rem;" title="Team owners" />
            </AppRailAnchor>
	        <AppRailAnchor href="/leaderboards" selected={$page.url.pathname === '/leaderboards'}>
                <iconify-icon icon="ion:ios-podium" style="font-size: 3.5rem;" title="Leaderboards" />
            </AppRailAnchor>
            <AppRailAnchor href="/drafts" selected={$page.url.pathname === '/drafts'}>
                <iconify-icon icon="ri:draft-fill" style="font-size: 3.5rem;" title="Drafts" />
            </AppRailAnchor>
        </AppRail>
    </svelte:fragment>
    
	<slot />

	<svelte:fragment slot="pageFooter">
        <section class="grid place-content-center h-20">
            <h2>Boot Scoot n Juke<iconify-icon icon="mdi:trademark" class="" /></h2>
        </section>
    </svelte:fragment>
</AppShell>
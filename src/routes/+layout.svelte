<script lang="ts">
    import "../app.css";
    import 'iconify-icon'

    import '@skeletonlabs/skeleton/themes/theme-vintage.css';
    import '@skeletonlabs/skeleton/styles/skeleton.css';

    import { AppShell } from '@skeletonlabs/skeleton';
    import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
    
    import { page } from '$app/stores';
    import { afterNavigate } from "$app/navigation";

    //scroll to top when route changes
    afterNavigate((params: any) => {
        const isNewPage: boolean = params.from && params.to && params.from.route.id !== params.to.route.id;
        const elemPage = document.querySelector('#page');
        if (isNewPage && elemPage !== null) {
            elemPage.scrollTop = 0;
        }
    });

</script>


<AppShell scrollGutter="auto">
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
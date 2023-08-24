<script lang="ts">
    import "../app.css";
    
    import '@skeletonlabs/skeleton/themes/theme-vintage.css';
    import '@skeletonlabs/skeleton/styles/skeleton.css';

    import { AppShell } from '@skeletonlabs/skeleton';
    import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';

    import { page } from '$app/stores';

    const logo = "/images/league_logo.png"
    
    import 'iconify-icon'
</script>


<AppShell>
	<svelte:fragment slot="sidebarLeft">       
        <AppRail border="border-solid border-r-2">
            <svelte:fragment slot="lead">
                <AppRailAnchor href="/">
                    <img src={logo} alt="Fantasy Logo"/>
                </AppRailAnchor>
            </svelte:fragment>
            <AppRailAnchor href="/" selected={$page.url.pathname === '/'}>
                <iconify-icon icon="mdi:home" style="font-size: 2rem;" title="Home"></iconify-icon>
            </AppRailAnchor>
	        <AppRailAnchor href="/owners" selected={$page.url.pathname === '/owners'}>
                <iconify-icon icon="mdi:account-group" style="font-size: 2rem;" title="Team Owners"></iconify-icon>
            </AppRailAnchor>
	        <AppRailAnchor href="/leaderboards" selected={$page.url.pathname === '/leaderboards'}>
                <iconify-icon icon="mdi:trophy" style="font-size: 2rem;" title="Leaderboards"></iconify-icon>
            </AppRailAnchor>
        </AppRail>
    </svelte:fragment>
    
	<slot />

	<svelte:fragment slot="pageFooter">
        <section class="grid place-content-center h-20">
            <h2>Boot Scoot n Juke<iconify-icon icon="mdi:trademark" class=""></iconify-icon></h2>
        </section>
    </svelte:fragment>
</AppShell>
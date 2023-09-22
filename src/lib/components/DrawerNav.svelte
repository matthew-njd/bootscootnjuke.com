<script lang="ts">
    import { page } from '$app/stores';
	import { AppRail, AppRailAnchor, AppShell, drawerStore } from '@skeletonlabs/skeleton';

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<AppShell>
	<svelte:fragment slot="sidebarLeft">       
		<AppRail>
			<AppRailAnchor href="/" selected={$page.url.pathname === '/'} on:click={drawerClose}>
				<iconify-icon icon="mdi:home" style="font-size: 3rem;" title="Home" />
			</AppRailAnchor>
			<AppRailAnchor href="/owners" selected={$page.url.pathname === '/owners'} on:click={drawerClose}>
				<iconify-icon icon="mdi:account-group" style="font-size: 3rem;" title="Team owners" />
			</AppRailAnchor>
			<AppRailAnchor href="/leaderboards" selected={$page.url.pathname === '/leaderboards'} on:click={drawerClose}>
				<iconify-icon icon="ion:ios-podium" style="font-size: 3.5rem;" title="Leaderboards" />
			</AppRailAnchor>
			<AppRailAnchor href="/drafts" selected={$page.url.pathname === '/drafts'} on:click={drawerClose}>
				<iconify-icon icon="ri:draft-fill" style="font-size: 3.5rem;" title="Drafts" />
			</AppRailAnchor>
		</AppRail>
	</svelte:fragment>
</AppShell>

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
				<div class="text-[0.65rem]">Home</div>
			</AppRailAnchor>
			<AppRailAnchor href="/owners" selected={$page.url.pathname === '/owners'} on:click={drawerClose}>
				<iconify-icon icon="mdi:account-group" style="font-size: 3rem;" title="Meet the Owners" />
				<div class="text-[0.65rem]">Owners</div>
			</AppRailAnchor>
			<AppRailAnchor href="/leaderboards" selected={$page.url.pathname === '/leaderboards'} on:click={drawerClose}>
				<iconify-icon icon="ion:ios-podium" style="font-size: 3.5rem;" title="Check out the Leaderboards" />
				<div class="text-[0.65rem]">Leaderboards</div>
			</AppRailAnchor>
			<AppRailAnchor href="/drafts" selected={$page.url.pathname === '/drafts'} on:click={drawerClose}>
				<iconify-icon icon="material-symbols:list-alt-outline" style="font-size: 3.5rem;" title="View the Draft History" />
				<div class="text-[0.65rem]">Draft History</div>
			</AppRailAnchor>
			<AppRailAnchor href="/matchups" selected={$page.url.pathname === '/matchups'} on:click={drawerClose}>
				<iconify-icon icon="material-symbols:swords-outline" style="font-size: 3rem;" title="See the weekly Matchup" />
				<div class="text-[0.65rem]">Matchups</div>
			</AppRailAnchor>
		</AppRail>
	</svelte:fragment>
</AppShell>

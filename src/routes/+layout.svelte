<script lang="ts">
    import "../app.css";
    
    import '@skeletonlabs/skeleton/themes/theme-rocket.css';
    import '@skeletonlabs/skeleton/styles/skeleton.css';
    import { TabAnchor, TabGroup } from "@skeletonlabs/skeleton";
    
    import 'iconify-icon'

    import { page } from "$app/stores";
</script>

<div class="min-h-screen flex flex-col">
    <TabGroup 
        justify="justify-end"
        active="variant-filled-primary"
        hover="hover:variant-soft-primary"
        flex="flex-1 lg:flex-none"
        rounded=""
        border=""
        class="bg-surface-100-800-token w-full"
    >
        <TabAnchor href="/" selected={$page.url.pathname === '/'}>
            <svelte:fragment slot="lead">
                <iconify-icon icon="mdi:home" style="font-size: 2rem;"></iconify-icon>
            </svelte:fragment>
            <span>Home</span>
        </TabAnchor>
        <TabAnchor href="/teams" selected={$page.url.pathname === '/teams'}>
            <svelte:fragment slot="lead">
                <iconify-icon icon="mdi:account-group" style="font-size: 2rem;"></iconify-icon>
            </svelte:fragment>
            <span>Teams</span>
        </TabAnchor>
        <TabAnchor href="/leaderboards" selected={$page.url.pathname === '/leaderboards'}>
            <svelte:fragment slot="lead">
                <iconify-icon icon="mdi:trophy" style="font-size: 2rem;"></iconify-icon>
            </svelte:fragment>
            <span>Leaderboards</span>
        </TabAnchor>
    </TabGroup>
    <div>
        <slot />
    </div>
</div>
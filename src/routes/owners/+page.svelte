<script lang="ts">
    export let data;
    console.log(data);
</script>

<h1>Meet the team owners</h1>
<div class="grid place-content-center">
    <ul>
        {#each data.owners as {id, name}}
            <li><a href="/owners/{id}">{name}</a></li>
        {/each}
    </ul>
</div>
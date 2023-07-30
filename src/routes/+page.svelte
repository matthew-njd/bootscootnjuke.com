<script lang="ts">
    import { db } from "$lib/firebase"
    import { collection, getDocs } from "firebase/firestore";

    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';

    const sourceData = [
        { position: 1, owner: "Matthew D'Agostino"},
    ];

    const ownersTable: TableSource = {
	    head: ['Owners'],
	    body: tableMapperValues(sourceData, ['owner']),
    };

    async function getAllOwners() {
        const owners = await getDocs(collection(db, "owners"));
        console.log(owners.size);

        owners.forEach((owner) => {
            
            console.log(owner.data().name);
        })
    }
    getAllOwners();

    async function getOwnerStats(docId: string) {
        const seasons = await getDocs(collection(db, "owners", docId, "seasons"));
        seasons.forEach((season) => {
            console.log(season.id, " => ", season.data());
        });
    }

    //getOwnerStats("matthew_dagostino");

</script>

<div class="grid place-content-center h-80">
    <div class="flex flex-col p-4 gap-4 text-center">
        <h1 class="text-6xl font-bold underline pb-4">Welcome to Boot Scoot n Juke!</h1>
        <h2 class="text-3xl">It's the the fantasy football league that all fantasy football leagues want to be.</h2>
    </div>
    <Table class="w-[400px]" source={ownersTable} />
</div>

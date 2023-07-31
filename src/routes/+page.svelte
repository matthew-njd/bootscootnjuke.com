<script lang="ts">
    import { db } from "$lib/firebase"
    import { collection, getDocs, type DocumentData } from "firebase/firestore";

    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import type { TableSource } from '@skeletonlabs/skeleton';

    // default values
    let sourceData: any[] = [];

    let ownersTable: TableSource = {
	    head: [],
	    body: tableMapperValues(sourceData, []),
    };

    async function getOwnersName() {
        try {
            let arr: DocumentData[] = []

            const owners = await getDocs(collection(db, "owners"));
            owners.forEach((owner) => {
                arr.push(owner.data().name);
            });

            return arr;
        } catch (error) {
            console.error("Error fetching owners:", error);
            throw error;
        }
    }

    getOwnersName()
        .then((owners) => {
            owners.forEach((owner, i) =>{
                sourceData.push({ position: i + 1, owner: owner},)
            }) 

            ownersTable = {
	            head: ['Owners'],
	            body: tableMapperValues(sourceData, ['owner']),
            };
        })
        .catch((error) => {
            console.error("Error:", error);
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function getOwnerStats(docId: string) {
        const seasons = await getDocs(collection(db, "owners", docId, "seasons"));
        seasons.forEach((season) => {
            console.log(season.id, " => ", season.data());
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    
</script>

<div class="grid place-content-center">
    <div class="flex flex-col p-4 gap-4 text-center">
        <h1 class="text-6xl font-bold underline pb-4">Welcome to Boot Scoot n Juke!</h1>
        <h2 class="text-3xl">It's the the fantasy football league that all fantasy football leagues want to be.</h2>
    </div>
    <Table class="w-full" source={ownersTable} />
</div>

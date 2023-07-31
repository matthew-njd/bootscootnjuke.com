<script lang="ts">
    import { db } from "$lib/firebase"
    import { collection, getDocs, } from "firebase/firestore";

    // import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    // import type { TableSource } from '@skeletonlabs/skeleton';
    // default values for table
    // let sourceData: any[] = [];
    // let ownersTable: TableSource = {
	//     head: [],
	//     body: tableMapperValues(sourceData, []),
    // };
    // async function getActiveOwnersName() {
    //     try {
    //         let arr: DocumentData[] = []

    //         const owners = await getDocs(collection(db, "owners"));
    //         owners.forEach((owner) => {
    //             if(owner.data().active) {
    //                 arr.push(owner.data().name);
    //             }
    //         });

    //         return arr;
    //     } catch (error) {
    //         console.error("Error fetching owners:", error);
    //         throw error;
    //     }
    // }

    // getActiveOwnersName()
    //     .then((owners) => {
    //         owners.forEach((owner, i) =>{
    //             sourceData.push({ position: i + 1, owner: owner},)
    //         }) 

    //         ownersTable = {
	//             head: ['Owners'],
	//             body: tableMapperValues(sourceData, ['owner']),
    //         };
    //     })
    //     .catch((error) => {
    //         console.error("Error:", error);
    // }); 
    // <Table class="w-full" source={ownersTable} />

    // GET FUNCTIONS
    // get all active owner's id
    let ownersId: string[] = []
    async function getActiveOwnersId() {
        try {
            const owners = await getDocs(collection(db, "owners"));
            owners.forEach((ownerId) => {
                if(ownerId.data().active) {
                    ownersId.push(ownerId.id);
                }
            });
            console.log(ownersId);
            console.log(ownersId[0]);
        } catch (error) {
            console.error("Error fetching owner's id:", error);
            throw error;
        }
    }
    getActiveOwnersId();
    
    // fucntion to get the season for a selected owner
    let seasons: any[] = []
    async function getOwnersSeasons(docId: string){
        try {
            const seasonsPerOwner = await getDocs(collection(db, "owners", docId, "seasons"));
            seasonsPerOwner.forEach((seasonPerOwner) => {
                seasons.push(seasonPerOwner.data());
            });
            console.log(seasons);
        } catch (error) {
            console.error("Error fetching seasons:", error);
            throw error;
        }
    }

    getOwnersSeasons("matthew_dagostino")
</script>

<h1>Meet the team owners</h1>
<div class="grid place-content-center">

</div>
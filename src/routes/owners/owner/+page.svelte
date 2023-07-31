<script lang="ts">
    import { db } from "$lib/firebase"
    import { collection, getDocs, type DocumentData } from "firebase/firestore";

    // get the stats of the selected team
    async function getOwnerStats(docId: string) {
        const seasons = await getDocs(collection(db, "owners", docId, "seasons"));
        seasons.forEach((season) => {
            console.log(season.id, " => ", season.data());
        });
    }
</script>
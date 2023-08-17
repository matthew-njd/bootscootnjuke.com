<script lang="ts">
    import { Avatar } from "@skeletonlabs/skeleton";

    const firstPlaceImage = "/images/first_place.png"
    const secondPlaceImage = "/images/second_place.png"
    const thirdPlaceImage = "/images/third_place.png"

</script>

<slot name="title" />
<div class="flex justify-center items-end">

    <!-- Second place -->
    <div class="card card-hover w-[300px] mr-2 min-h-[300px]">
        <header class="flex justify-center card-header">
            <Avatar src={secondPlaceImage} width="w-[35%]" rounded="rounded-md" background="none" />
        </header>
        <section class="text-2xl text-center p-4">
            <slot name="secondPlaceName" />
        </section>
        <footer class="card-footer text-center">
            <slot name="secondPlaceStat" />
        </footer>
    </div>

    <!-- First place -->
    <div class="card card-hover w-[300px] min-h-[350px]">
        <header class="flex justify-center card-header">
            <Avatar src={firstPlaceImage} width="w-[40%]" rounded="rounded-md" background="none" />
        </header>
        <section class="text-3xl text-center p-4">
            <slot name="firstPlaceName" />
        </section>
        <footer class="card-footer text-center">
            <slot name="firstPlaceStat" />
        </footer>
    </div>

    <!-- Third place -->
    <div class="card card-hover w-[300px] ml-2 min-h-[250px]">
        <header class="flex justify-center card-header">
            <Avatar src={thirdPlaceImage} width="w-[30%]" rounded="rounded-md" background="none" />
        </header>
        <section class="text-xl text-center p-4">
            <slot name="thirdPlaceName" />
        </section>
        <footer class="card-footer text-center">
            <slot name="thirdPlaceStat" />
        </footer>
    </div>
</div>
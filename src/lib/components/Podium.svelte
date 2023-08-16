<script lang="ts">
    import { Avatar } from "@skeletonlabs/skeleton";

    const firstPlaceImage = "/images/first_medal.png"
    const secondPlaceImage = "/images/second_medal.png"
    const thirdPlaceImage = "/images/third_medal.png"

</script>

<div class="pt-[100px]">
    <slot name="title">
        <h2>Title</h2>
    </slot>
    <div class="flex justify-center pt-8">
        <div class="align-baseline pr-2">
            <div class="card card-hover w-[300px]">
                <header class="flex justify-center card-header">
                    <Avatar src={secondPlaceImage} width="w-20" rounded="rounded-md" background="none" />
                </header>
                <section class="text-2xl text-center p-4">
                    <slot name="secondPlace">
                        <span>Unknown</span>
                    </slot>
                    <iconify-icon icon="twemoji:trophy" style="font-size: 1.1rem;"></iconify-icon>
                </section>
            </div>
        </div>
        <div class="align-baseline">
            <div class="card card-hover w-[300px]">
                <header class="flex justify-center card-header">
                    <Avatar src={firstPlaceImage} width="w-20" rounded="rounded-md" background="none" />
                </header>
                <section class="text-2xl text-center p-4">
                    <slot name="firstPlace">
                        <span>Unknown</span>
                    </slot>
                    <iconify-icon icon="twemoji:trophy" style="font-size: 1.1rem;"></iconify-icon>
                </section>
            </div>
        </div>
        <div class="align-baseline pl-2">
            <div class="card card-hover w-[300px]">
                <header class="flex justify-center card-header">
                    <Avatar src={thirdPlaceImage} width="w-20" rounded="rounded-md" background="none" />
                </header>
                <section class="text-2xl text-center p-4">
                    <slot name="thirdPlace">
                        <span>Unknown</span>
                    </slot>
                    <iconify-icon icon="twemoji:trophy" style="font-size: 1.1rem;"></iconify-icon>
                </section>
            </div>
        </div>
    </div>
</div>
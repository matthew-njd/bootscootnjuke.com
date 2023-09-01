<div class="flex flex-col card card-hover m-1 w-[175px] h-[275px]">
    <header class="card-header text-xl text-center">
        <slot name="player"/>
    </header>
    <section class="text-lg text-center text-gray-400">
        <slot name="team" />
    </section>
</div>
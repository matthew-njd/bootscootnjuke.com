<div class="flex flex-col card card-hover m-1 w-[175px]">
    <header class="card-header text-xl text-center">
        <slot name="header"/>
    </header>
    <section class="text-lg text-center ">
        <slot name="section" />
    </section>
    <footer class="card-footer text-center text-[#EA861A]">
        <slot name="footer" />
    </footer>
</div>
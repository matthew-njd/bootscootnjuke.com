<script lang="ts">
    const logo = "/images/league_logo.png"
    const loudspeaker = "/images/loudspeaker.png"
    const ribbon = "/images/ribbon.png"
</script>

<div class="grid justify-items-end">
    <img src={logo} alt="League Logo" class="w-[9rem] p-2" />
</div>
<div class="grid place-items-center m-auto p-6 max-w-[1080px] gap-8">
    <h1 class="text-center text-6xl font-bold">Greetings and Welcome to Boot Scoot n' Juke, The Premier Fantasy Football League.</h1>
    <h2 class="text-center text-3xl">
        Here you can check out the different owners and their team's jaw-dropping stats! Unearth the titans who've dominated the leaderboards, and get set for a heart-pounding journey through the draft history!
    </h2>

    
    <!--Announcement section-->
    <div class="card p-2 mt-10">
        <header class="card-header flex justify-center items-center gap-2">
            <img src={loudspeaker} alt="Loudspeaker Logo" class="w-[3rem] scale-x-[-1]" />
            <h1 class="text-2xl text-[#EA861A] text-center">
                Boot Scoot N' Juke Announcement
            </h1>
            <img src={loudspeaker} alt="Loudspeaker Logo" class="w-[3rem]" />
        </header>
        <section class="p-4">
            <div class="text-center">
                <h1 class="text-3xl mt-8 mb-4">Congratulations to Rudy D'Agostino and his team, I'm in the Bills Mafia 🤌 for winning the 2025 Z10 championship🏆!!</h1>
            </div>
        </section>
        <footer class="card-footer text-xs text-[#EA861A]"><i>Updated Decemeber 30th, 2025 by your site admin</i></footer>
    </div>
</div>
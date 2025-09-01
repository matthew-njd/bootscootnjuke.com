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
                <h1 class="text-3xl mt-8 mb-4">The Road to Fantasy Glory: Season 2025 is just around the corner...</h1>
            </div>

            <div class="mt-4">
                <p>
                    In the quiet before kickoff, anticipation hangs heavy in the air. Lineups are locked, but destiny remains unwritten. Heroes will rise from the shadows, legends will be born in the clutch, and heartbreak will strike when victory feels certain. Every yard, every point, every moment carries the weight of glory or defeat. This is more than a game... this is the season where champions are forged. Welcome to THE fantasy football league where every week is a battle, and only one can stand at the summit.
                </p>
            </div>
        </section>
        <footer class="card-footer text-xs text-[#EA861A]"><i>Updated September 1st, 2025 by your site admin</i></footer>
    </div>
</div>
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

    
    <!--Weekly update section-->
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
                <h2 class="text-3xl mt-8 mb-4">Your 2024 Champion is...</h2>
                <h1 class="text-5xl mb-2">Patriots of Pigskin</h1>
                <img src="https://kfgycginbwcwzvruujeh.supabase.co/storage/v1/object/public/logos/troy_mccusker_logo.png" alt="Patriots of Pigskin Logo" class="w-[8rem] m-auto" />
            </div>

            <div class="mt-4">
                <p>
                    Congradualtions to Troy McCusker for winning the 2024 Boot Scoot N' Juke Championship and securing his second Z10! The Patriots of Pigskin had a stellar season, finishing with a 12-2 record and defeating the 2nd place team, Mr. Unlimited, in a very tough fought championship battle.
                </p>
            </div>
        </section>
        <footer class="card-footer text-xs text-[#EA861A]"><i>Updated January 2, 2025 by your site admin</i></footer>
    </div>
</div>
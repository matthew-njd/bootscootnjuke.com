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
                Boot Scoot N' Juke Weekly
            </h1>
            <img src={loudspeaker} alt="Loudspeaker Logo" class="w-[3rem]" />
        </header>
        <section class="p-4">
            <div class="text-[#EA861A] text-center">
                <h2 class="text-4xl mt-8">Week 1: Inaugural Issue</h2>
                <h3 class="text-lg italic">A weekly recap of the happenings in the League we love.</h3>
            </div>

            <div class="pt-4">
                <!--Intro section-->
                <div class="p-2">
                    <p>
                        It has been 249 days, 6 hours, 48 minutes and 59 seconds since Matthew Fettucini D'Agostino was crowned the 2023 Z10 champion! The draft complete. Lineups set. 10 managers with unbridled anticipation and blind belief that they will be victorious.
                    </p>
                    <p class="mt-2 mb-2">
                        This newsletter will hopefully serve as an “unbiased” recap to the week past, provide a little humour, a little shame but most of all some good clean fantasy fun. The format will change.
                    </p>
                    <p>
                        Good luck to all and apologies in advance for our unedited ramblings.
                    </p>
                </div>
                
                <!--Award section-->
                <div class="p-2 mt-6">
                    <div class="flex justify-center items-center gap-2">
                        <img src={ribbon} alt="Ribbon Logo" class="w-[3rem]" />
                        <h1 class="text-4xl underline">
                            Awards 
                        </h1>
                        <img src={ribbon} alt="Ribbon Logo" class="w-[3rem]" />
                    </div>
                    <div class="p-2">
                        <h2 class="text-xl italic">Stud Muffin of the Week</h2>
                        <div class="mt-2">
                            <p class="text-[#EA861A]">Saquon Barkley - Patriots of Pigskin</p>
                            <p>
                                As I said earlier, unbiased analysis! Sporting quads only slightly smaller than that of his Fantasy manager, Saquads Barkley gave the Patriots of Pigskin the Brazilian butt lift they needed to suffocate Brady Gaga faster than a Rakishi stinkface.
                            </p>
                        </div>
                    </div>

                    <div class="p-2">
                        <h2 class="text-xl italic">Big Bench Boy</h2>
                        <div class="mt-2">
                            <p class="text-[#EA861A]">Jayden Reed - Rovers Rams</p>
                            <p>
                                31.10 points. Jayden Reed's big performance was impressive but unfortunately Club D'Agostino was at capacity and had no room for Jayden. Thankfully Jayden kept warm with his buddies Rhamondre and J.K. & Rovers Rams are what the patrons of the Club are yelling when they start a tab, "Runner Up!"
                            </p>
                        </div>
                    </div>    
                        
                    <div class="p-2">
                        <h2 class="text-xl italic">Jammiest Bastard</h2>
                        <div class="mt-2">
                            <p class="text-[#EA861A]">Put me in Coach - Al Rover</p>
                            <p>
                                Some may say that missing out on Tyreek Hill in the 8th Round is unlucky, not Al. He uses that as bulletin board material and puts up 126.48, starting a near perfect lineup and cruising away from Week 1 with an easy victory.
                            </p>
                        </div>
                    </div>
                        
                    <div class="p-2">
                        <h2 class="text-xl italic">Missing in Action</h2>
                        <div class="mt-2">
                            <p class="text-[#EA861A]">I'm in the Bills Mafia - Rudy D'Agostino</p>
                            <p>
                                We're not sure if he's lost on George Street after a night on the lash or if the Screech has permanently blurred his vision but he was missed at the draft and he seems to still be MIA. Rudy started the season slower than Sean Stellato's least favourite QB to come out of York University. Pick it up Rudy, maybe run some hills and do fast twitch exercises (whatever the fuck those are)  and you'll be better next week. 
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <footer class="card-footer text-xs"><i>by Yort Reksuccm on September 09, 2024</i></footer>
    </div>
</div>
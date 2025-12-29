import Loudspeaker from "../assets/images/loudspeaker.png";

function Home() {
  return (
    <div className="grid place-items-center m-auto p-6 gap-8">
      <h1 className="text-center text-6xl font-bold">
        Greetings and Welcome to Boot Scoot n' Juke, The Premier Fantasy
        Football League.
      </h1>
      <h2 className="text-center text-3xl">
        Here you can check out the different owners and their team's
        jaw-dropping stats! Unearth the titans who've dominated the
        leaderboards, and get set for a heart-pounding journey through the draft
        history!
      </h2>
      <div className="card p-2 mt-10">
        <header className="card-header flex justify-center items-center gap-2">
          <img
            src={Loudspeaker}
            alt="Loudspeaker Logo"
            className="w-12 scale-x-[-1]"
          />
          <h1 className="text-2xl text-center text-error">
            Boot Scoot N' Juke Announcement
          </h1>
          <img src={Loudspeaker} alt="Loudspeaker Logo" className="w-12" />
        </header>
        <section className="p-4">
          <div className="text-center">
            <h1 className="text-3xl mt-8 mb-4">
              Your 2025 Z10 winner is...{" "}
              <span className="underline font-bold">TBD</span>
            </h1>
          </div>
        </section>
        <div className="card-footer text-xs text-primary">
          <i>Updated December 30th, 2025 by your site admin</i>
        </div>
      </div>
    </div>
  );
}

export default Home;

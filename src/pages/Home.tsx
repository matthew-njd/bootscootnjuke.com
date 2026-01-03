import Card from "../components/common/Card";
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

      <Card
        title={
          <>
            <img
              src={Loudspeaker}
              alt="Loudspeaker Logo"
              className="w-12 scale-x-[-1]"
            />
            Boot Scoot N' Juke Announcement{" "}
            <img src={Loudspeaker} alt="Loudspeaker Logo" className="w-12" />
          </>
        }
        body={
          <>
            Your 2025 Z10 winner is Rudy D'Agostino and his team,{" "}
            <span className="font-bold">I'm in the Bills Mafia 🤌</span>
          </>
        }
        footer={
          <>
            <p>Updated December 30th, 2025 by your site admin</p>
          </>
        }
        className="card bg-primary text-primary-content w-full"
        cardBodyClassName="card-body items-center text-center"
        titleClassName="card-title text-3xl font-bold"
        bodyClassName="text-2xl m-4"
        footerClassName="card-footer text-xs italic"
      />
    </div>
  );
}

export default Home;

import Card from "../components/common/Card";
import Loudspeaker from "../assets/images/loudspeaker.png";
import { Link } from "react-router-dom";

export default function Home() {
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
            Boot Scoot n' Juke Announcement{" "}
            <img src={Loudspeaker} alt="Loudspeaker Logo" className="w-12" />
          </>
        }
        body={
          <>
            Your 2025 Z10 winner is Rudy D'Agostino and his team,{" "}
            <Link
              to={"/owners/rudy_dagostino/stats"}
              className="font-bold hover:underline"
            >
              I'm in the Bills Mafia
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M22.82 2c.52 0 1 .15 1.42.4c.23.15 5.79 3.9 5.81 10.67c0 3.144-1.202 5.716-2.485 7.564a15 15 0 0 1-2.13 3.34l-.002.003a18.5 18.5 0 0 1-1.899 1.932a17.6 17.6 0 0 1-1.976 1.627C18.352 29.821 14.498 31 10.58 31H3c-1.102 0-2-.898-2-2v-9c0-1.102.898-2 2-2h4.46c1.054 0 2.022-.56 2.543-1.468l.002-.005l5.315-9.14a3.83 3.83 0 0 1 1.949-1.712c.305-1.933 2.103-3.35 3.996-3.174A2.65 2.65 0 0 1 22.82 2m-1.068 2.723c-1.093-.657-2.619.23-2.524 1.65l.005.082c.296.055.59.16.867.315a2.87 2.87 0 0 1 1.446 2.037l.655.908c1.072 1.485 1.629 3.117 1.629 4.845c0 .208-.01.404-.02.58l-.002.046l-.001.014c-.183 2.28-2.107 4.01-4.377 4.01a2.406 2.406 0 0 1-2.092-3.579c.365-.66.738-1.292 1.105-1.91c.752-1.27 1.472-2.485 2.017-3.79l.007-.016l.044-.106a1.87 1.87 0 0 0-.894-2.163l-.005-.003a1.78 1.78 0 0 0-1.182-.21l-.291.054a1.83 1.83 0 0 0-1.073.875l-.005.01l-5.325 9.158A4.93 4.93 0 0 1 7.46 20H3v9h7.58c3.52 0 6.966-1.06 9.82-3.094l.005-.004a16 16 0 0 0 1.766-1.457l.015-.014l.015-.014a16.5 16.5 0 0 0 1.706-1.733c4.64-5.505 3.974-13.86-2.155-17.96m-1.677 10.17c-.348.59-.687 1.162-.99 1.71l-.003.007l-.004.006a.36.36 0 0 0-.048.184c0 .232.187.41.4.41c1.246 0 2.279-.944 2.382-2.157v-.003c.01-.188.018-.336.018-.49q.002-1.06-.38-2.075c-.437.823-.915 1.631-1.375 2.409"
                />
              </svg>
            </Link>
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

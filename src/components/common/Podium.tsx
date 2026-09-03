import React from "react";
import firstPlaceImage from "../../assets/images/first_place.png";
import secondPlaceImage from "../../assets/images/second_place.png";
import thirdPlaceImage from "../../assets/images/third_place.png";

interface Place {
  stat: React.ReactNode;
  details: React.ReactNode;
}

interface PodiumProps {
  title?: React.ReactNode;
  firstPlace: Place;
  secondPlace: Place;
  thirdPlace: Place;
  seeMoreButton?: React.ReactNode;
}

export default function Podium({
  title,
  firstPlace,
  secondPlace,
  thirdPlace,
  seeMoreButton,
}: PodiumProps) {
  const positions = [
    {
      data: secondPlace,
      image: secondPlaceImage,
      rank: "2nd",
      order: "sm:order-1",
      pad: "sm:pt-10",
      statSize: "text-2xl",
    },
    {
      data: firstPlace,
      image: firstPlaceImage,
      rank: "1st",
      order: "sm:order-2",
      pad: "",
      statSize: "text-4xl",
    },
    {
      data: thirdPlace,
      image: thirdPlaceImage,
      rank: "3rd",
      order: "sm:order-3",
      pad: "sm:pt-16",
      statSize: "text-xl",
    },
  ];

  return (
    <section className="w-full">
      {title && (
        <h2 className="wood-type text-2xl sm:text-3xl uppercase text-center mb-6">
          {title}
        </h2>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-center gap-4">
        {positions.map(({ data, image, rank, order, pad, statSize }) => (
          <div key={rank} className={`w-full sm:w-64 ${order} ${pad}`}>
            <div className="border-2 border-base-content bg-base-100">
              <div className="flex items-center justify-between px-3 py-1.5 bg-primary text-primary-content border-b-2 border-base-content">
                <span className="label-caps text-[0.65rem]">{rank}</span>
                <img src={image} alt="" className="w-6" aria-hidden />
              </div>

              <div className="p-4 text-center">
                <div className={`figures ${statSize} leading-tight`}>
                  {data.stat}
                </div>
                <div className="mt-3 text-sm text-base-content/70 leading-snug">
                  {data.details}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {seeMoreButton && (
        <div className="mt-5 flex justify-center">{seeMoreButton}</div>
      )}
    </section>
  );
}

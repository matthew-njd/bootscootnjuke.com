import React from "react";
import Card from "./Card";

import firstPlaceImage from "../../assets/images/first_place.png";
import secondPlaceImage from "../../assets/images/second_place.png";
import thirdPlaceImage from "../../assets/images/third_place.png";

interface PodiumProps {
  title?: React.ReactNode;
  firstPlace: {
    stat: React.ReactNode;
    details: React.ReactNode;
  };
  secondPlace: {
    stat: React.ReactNode;
    details: React.ReactNode;
  };
  thirdPlace: {
    stat: React.ReactNode;
    details: React.ReactNode;
  };
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
    { data: secondPlace, image: secondPlaceImage, alt: "Second Place", textSize: "text-2xl", minHeight: "min-h-75", imageWidth: "w-[35%]", spacing: "pt-6 pb-2", margin: "mr-2" },
    { data: firstPlace, image: firstPlaceImage, alt: "First Place", textSize: "text-3xl", minHeight: "min-h-100", imageWidth: "w-[40%]", spacing: "pt-8 pb-2"},
    { data: thirdPlace, image: thirdPlaceImage, alt: "Third Place", textSize: "text-xl", minHeight: "min-h-62.5", imageWidth: "w-[30%]", spacing: "pt-4 pb-2", margin: "ml-2" },
  ];

  return (
    <div className="flex flex-col md:flex-wrap justify-center lg:grid">
      {title && <div className="text-3xl mb-2">{title}</div>}

      <div className="flex justify-center items-end">
        {positions.map(({ data, image, alt, textSize, minHeight, imageWidth, spacing, margin = "" }, idx) => (
          <Card
            key={idx}
            title={
              <div className="flex justify-center">
                <img src={image} alt={`${alt} (freepik icon)`} className={`mt-2 ${imageWidth}`} />
              </div>
            }
            body={
              <div className={`flex justify-center ${textSize} ${spacing} font-bold`}>
                {data.stat}
              </div>
            }
            footer={<div className="text-center w-full font-medium italic">{data.details}</div>}
            className={`bg-primary text-base-100 w-75 ${minHeight} ${margin} rounded`}
            cardBodyClassName="card-body"
            titleClassName=""
            bodyClassName=""
          />
        ))}
      </div>

      {seeMoreButton && (
        <div className="btn btn-soft btn-primary mt-2">{seeMoreButton}</div>
      )}
    </div>
  );
}
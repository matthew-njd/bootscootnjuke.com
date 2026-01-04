import React from "react";
import Card from "./Card";

import firstPlaceImage from "../../assets/images/first_place.png";
import secondPlaceImage from "../../assets/images/second_place.png";
import thirdPlaceImage from "../../assets/images/third_place.png";

interface PodiumProps {
  title?: React.ReactNode;
  firstPlace: {
    name: React.ReactNode;
    stat: React.ReactNode;
  };
  secondPlace: {
    name: React.ReactNode;
    stat: React.ReactNode;
  };
  thirdPlace: {
    name: React.ReactNode;
    stat: React.ReactNode;
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
  return (
    <div className="flex flex-col md:flex-wrap justify-center lg:grid">
      {title && <div className="text-3xl mb-2">{title}</div>}

      <div className="flex justify-center items-end">
        {/* Second place */}
        <Card
          title={
            <div className="flex justify-center">
              <img
                src={secondPlaceImage}
                alt="Second Place (freepik icon)"
                className="mt-2 w-[35%]"
              />
            </div>
          }
          body={
            <div className="text-2xl text-center pt-6 pb-2">
              {secondPlace.name}
            </div>
          }
          footer={<div className="text-center w-full">{secondPlace.stat}</div>}
          className="bg-primary text-base-100 w-75 mr-2 min-h-75 rounded"
          cardBodyClassName="card-body"
          titleClassName=""
          bodyClassName=""
        />

        {/* First place */}
        <Card
          title={
            <div className="flex justify-center">
              <img
                src={firstPlaceImage}
                alt="First Place (freepik icon)"
                className="mt-2 w-[40%]"
              />
            </div>
          }
          body={
            <div className="text-3xl text-center pt-8 pb-2">
              {firstPlace.name}
            </div>
          }
          footer={<div className="text-center w-full">{firstPlace.stat}</div>}
          className="bg-primary text-base-100 w-75 min-h-100 rounded"
          cardBodyClassName="card-body"
          titleClassName=""
          bodyClassName=""
        />

        {/* Third place */}
        <Card
          title={
            <div className="flex justify-center">
              <img
                src={thirdPlaceImage}
                alt="Third Place (freepik icon)"
                className="mt-2 w-[30%]"
              />
            </div>
          }
          body={
            <div className="text-xl text-center pt-4 pb-2">
              {thirdPlace.name}
            </div>
          }
          footer={<div className="text-center w-full">{thirdPlace.stat}</div>}
          className="bg-primary text-base-100 w-75 ml-2 min-h-62.5 rounded"
          cardBodyClassName="card-body"
          titleClassName=""
          bodyClassName=""
        />
      </div>

      {/* Optional see more button */}
      {seeMoreButton && (
        <div className="btn btn-soft btn-primary mt-2">{seeMoreButton}</div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";

type Props = {
  charaName: string;
  characteristic: string;
  imagePass: string;
};

const CharaInfo = ({ charaName, characteristic, imagePass }: Props) => {
  return (
    <div className="p-7 bg-white rounded-lg drop-shadow">
      <div className="grid md:grid-cols-2 gap-7">
        <div className="">
          {imagePass ? (
            <Image
              src={imagePass}
              alt="image"
              width={1024}
              height={1024}
              className="rounded-lg"
            />
          ) : (
            <div className="skeleton" style={{ aspectRatio: "1 / 1" }}></div>
          )}
        </div>
        <div className="flex flex-col items-center gap-5">
          {charaName ? (
            <p className="text-2xl md:text-4xl font-extrabold">{charaName}</p>
          ) : (
            <div className="skeleton h-10 w-44 md:w-64"></div>
          )}
          {characteristic ? (
            <p className="md:text-2xl text-justify">{characteristic}</p>
          ) : (
            <>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharaInfo;

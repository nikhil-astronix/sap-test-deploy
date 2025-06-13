import React from "react";
import Image from "next/image";

export default function NoResultsFound() {
  return (
    <div className="col-span-full flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/NotFoundillustration.svg"
          height={129}
          width={124}
          alt="NotFoundillustration"
        />
        <p className="text-black text-[20px] font-semibold mt-4 mb-2">
          No Results Found
        </p>
        <span className="text-black text-[14px] font-normal">
          Hmm… no results. Maybe try something else?
        </span>
      </div>
    </div>
  );
}

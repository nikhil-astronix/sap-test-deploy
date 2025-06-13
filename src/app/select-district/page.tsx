import React from "react";
import Image from "next/image";

const Selectdistricts = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white shadow-md overflow-hidden">
      <Image
        src="selectdistricts.svg"
        alt="Select Districts"
        width={200}
        height={200}
        className="rounded-lg"
      />
      <h1 className="text-2xl font-normal mt-4">
        Select a District to Begin Setup
      </h1>
      <p className="text-gray-600 text-[14px] mt-2 max-w-lg text-center">
        To configure networks, schools, users, and more, please select a
        district from the dropdown on the left. This ensures that all setup
        steps are associated with the correct district.
      </p>
    </div>
  );
};

export default Selectdistricts;

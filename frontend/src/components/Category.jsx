import React, { useState } from "react";
import CategoryButtons from "./Category Section/CategoryButtons";
import EventGrid from "./Category Section/EventGrid";

const Category = () => {

  return (
    <>
      <div className="bg-[#ebe7e7] w-full flex flex-col items-center px-4 py-6">
        <CategoryButtons />
        <EventGrid/>
      </div>
    </>
  );
};

export default Category;

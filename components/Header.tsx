import React from "react";
import { FaUniversity } from "react-icons/fa";

const Header = () => {
  return (
    <div className="flex gap-3 p-4 items-center border-b shadow">
      <FaUniversity size={40} />
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold leading-5 mt-1">Hello Desk</h1>
        <p className="uppercase text-neutral-500 text-sm">providence college of engineering</p>
      </div>
    </div>
  );
};

export default Header;

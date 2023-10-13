import React from "react";

const Chip = ({ color = "indigo", darkText = false, value }) => {
  return (
    <div className="flex align-baseline gap-2 ml-2">
      <div
        className={`select-none whitespace-nowrap rounded-full bg-${color}-600 py-1 px-2 text-xs font-bold uppercase leading-none ${
          darkText ? "text-gray-600" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
};

export default Chip;

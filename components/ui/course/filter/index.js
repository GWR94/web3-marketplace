import { Button } from "@components/ui/common";
import { useState } from "react";

const OPTIONS = ["All", "Purchased", "Activated", "Deactivated"];

export default function CourseFilter({ onSubmit, onFilterSelect, filter }) {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="border-2 p-4 my-4 w-full rounded-xl max-w-2xl">
      <div className="flex flex-col items-center my-4">
        <p className="italic mb-5">Search with a hashed address</p>
        <div className="flex relative rounded-md mb-3 w-full justify-center">
          <input
            type="text"
            name="account"
            id="account"
            onChange={(e) => setSearchText(e.target.value)}
            className="focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md w-full sm:w-2/3"
            placeholder="0x2341ab..."
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />
          <Button
            size="sm"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            onClick={() => onSubmit(searchText)}
          >
            Search
          </Button>
        </div>
        <hr className="my-4 w-full" />
        <p className="italic mb-5">
          Filter by course state within the dropdown box
        </p>
        <div className="relative text-gray-700">
          <select
            className="w-72 h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline"
            onChange={(e) => onFilterSelect(e.target.value)}
            value={filter}
            placeholder="Enter search type..."
          >
            {OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

import { addSpaceToCaps, capitalize } from "@utils/textUtils";
import ActivationButtons from "../activate";
export default function ManagedCourseCard({
  course,
  search = false,
  children,
}) {
  const Item = ({ title, value, bgColor }) => {
    const needsActivation =
      title.trim() == "State" && value.trim() == "Purchased";
    return (
      <div className={`flex flex-col align-middle ${bgColor} px-4 py-2`}>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="inline-flex items-center justify-between mt-1 text-sm text-gray-900 sm:mt-0 h-10">
          <p className="break-words w-full ">{value}</p>
          {needsActivation && <ActivationButtons />}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border shadow overflow-hidden sm:rounded-lg h-full">
      {Object.keys(course).map((key, i) => (
        <Item
          key={i}
          bgColor={
            i % 2 === 0 ? (search ? "bg-blue-100" : "bg-gray-50") : "bg-white"
          }
          title={addSpaceToCaps(capitalize(key))}
          value={`${capitalize(course[key])} ${key === "price" ? "Ξ" : ""}`}
        />
      ))}
      <div
        className={`flex-col ${
          search ? "bg-blue-100" : "bg-gray-50"
        } px-4 py-5`}
      >
        {children}
      </div>
    </div>
  );
}

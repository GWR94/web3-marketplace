import { addSpaceToCaps, capitalize } from "@utils/capitalize";

export default function ManagedCourseCard({ course, children }) {
  const Item = ({ title, value, className }) => (
    <div className={`${className} px-4 py-5 sm:px-6`}>
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {value}
      </div>
    </div>
  );
  return (
    <div className="bg-white border shadow overflow-hidden sm:rounded-lg mb-3">
      <div className="flex">
        <div className="border-t border-gray-200">
          {Object.keys(course).map((key, i) => (
            <Item
              key={i}
              className={i % 2 === 0 && "bg-gray-50"}
              title={addSpaceToCaps(capitalize(key))}
              value={`${capitalize(course[key])} ${key === "price" ? "Ξ" : ""}`}
            />
          ))}
          <div className="bg-white px-4 py-5 sm:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

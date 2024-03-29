import Image from "next/image";

const STATE_COLOURS = {
  purchased: "indigo",
  activated: "green",
  deactivated: "red",
};
export default function OwnedCourseCard({ course, children }) {
  const stateColour = STATE_COLOURS[course.state];
  return (
    <div className="bg-white border shadow overflow-hidden sm:rounded-lg mb-3">
      <div className="block sm:flex">
        <div className="flex-1">
          <div className="h-72 sm:h-full next-image-wrapper">
            <Image
              className="object-cover"
              src={course.coverImage}
              width="45"
              height="45"
              layout="responsive"
              alt={course.title}
            />
          </div>
        </div>
        <div className="flex-4">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {course.title}{" "}
              <em className="text-gray-500 text-sm">by {course.author}</em>
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {course.price} ETH
            </p>
            <span
              className={`text-xs text-${stateColour}-700 bg-${stateColour}-200 rounded-full p-2 mt-1 inline-block`}
            >
              {course.state}
            </span>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Course ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {course.ownedCourseId}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Proof</dt>
                <dd className="mt-1 break-words text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {course.proof}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:px-6">{children}</div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

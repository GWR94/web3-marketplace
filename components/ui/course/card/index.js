import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

const Card = ({ course, disabled, Footer }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      key={course.id}
      className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl"
    >
      <div className="flex h-full">
        <div className="flex-1 h-full next-image-wrapper">
          <Image
            className={`${disabled && "filter grayscale"} object-cover`}
            src={course.coverImage}
            layout="responsive"
            width="200"
            height="230"
            alt={course.title}
          />
        </div>
        <div className="flex-2 p-8 pb-4">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            {course.type}
          </div>
          <Link href={`/courses/${course.slug}`}>
            <a className="block h-12 mt-1 text-sm xs:text-lg leading-tight font-medium text-black hover:underline">
              {course.title}
            </a>
          </Link>
          <p className="mt-2 text-gray-500 text-sm xs:text-base">
            {expanded
              ? course.description
              : course.description.split(" ").slice(0, 12).join(" ")}{" "}
            {!expanded && (
              <span
                className="text-blue cursor-pointer hover:text-blue-700"
                onClick={() => setExpanded(true)}
              >
                ...
              </span>
            )}
          </p>
          {Footer && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default Card;

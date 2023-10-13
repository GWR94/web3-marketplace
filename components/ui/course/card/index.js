import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Chip } from "@components/ui/common";

const Card = ({ course, disabled, Footer, state }) => {
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
          <div className="inline-flex align-baseline">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {course.type}
            </div>
            <div>
              {(state === "activated" && (
                <Chip color="green" value="Activated" />
              )) ||
                (state === "deactivated" && (
                  <Chip color="red" value="Deactivated" />
                )) ||
                (state === "purchased" && <Chip value="Purchased" />)}
            </div>
          </div>
          <div>
            <Link href={`/courses/${course.slug}`}>
              <a className="block h-12 mt-1 text-sm sm:text-base xs:text-lg leading-tight font-medium text-black hover:underline">
                {course.title}
              </a>
            </Link>
          </div>
          <p className="my-2 text-gray-500 text-sm xs:text-base">
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
          {Footer && (
            <div className="flex justify-end">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;

import Image from "next/legacy/image";

export default function List({ courses }) {
  console.log(courses);
  return (
    <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-xl shadow-md md:max-w-2xl"
        >
          <div className="flex h-full">
            <div className="flex h-full">
              <Image
                className="object-cover"
                src={course.coverImage}
                alt={course.title}
                width="200"
                height="230"
                layout="fixed"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {course.type}
              </div>
              <a
                href={course.link}
                className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
              >
                {course.title} - <em>[{course.author}]</em>
              </a>
              <p className="mt-2 text-gray-500">{course.description}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

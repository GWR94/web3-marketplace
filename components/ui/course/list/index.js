export default function List({ courses, children }) {
  return (
    <div className="flex w-full">
      {courses.map((course) => children(course))}
    </div>
  );
}

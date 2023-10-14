export default function List({ courses, children }) {
  return <div>{courses.map((course) => children(course))}</div>;
}

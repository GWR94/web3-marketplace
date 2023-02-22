import courses from "./index.json";

export const getAllCourse = () => {
  return {
    data: courses,
    courseMap: courses.reduce((accum, course, increment) => {
      accum[course.id] = course;
      accum[course.id].index = increment;
      return a;
    }, {}),
  };
};

import courses from "./index.json";

export const getAllCourses = () => {
  return {
    data: courses,
    courseMap: courses.reduce((accum, course, idx) => {
      accum[course.id] = course;
      accum[course.id].index = idx;
      return accum;
    }, {}),
  };
};

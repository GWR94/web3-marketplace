import { normalizeOwnedCourse } from "@utils/normalize";
import useSWR from "swr";

export const handler = (web3, contract) => (account) => {
  const swrRes = useSWR(
    () =>
      // if there is a web3, contract and account present, complete the query, otherwise return null
      web3 && contract && account.data && account.isAdmin
        ? `web3/managedCourses/${account.data}`
        : null,
    async () => {
      // initialise array for courses to be pushed into
      const courses = [];
      const courseCount = await contract.methods.getCourseCount().call();
      // reverse the loop through the courses from back to front so the first course is first
      for (let i = Number(courseCount) - 1; i >= 0; i--) {
        // get the course hash from the contract
        const courseHash = await contract.methods
          .getCourseHashAtIndex(i)
          .call();
        // get the course based from the course hash attained above
        const course = await contract.methods
          .getCourseByHash(courseHash)
          .call();
        if (course) {
          // normalize the course before pushing it into the courses array.
          const normalized = normalizeOwnedCourse(web3)(
            // inject the hash within the course so it can be viewed from frontend
            { hash: courseHash },
            course
          );
          courses.push(normalized);
        }
      }
      return courses;
    }
  );

  return swrRes;
};

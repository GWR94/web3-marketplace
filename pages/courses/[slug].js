import { Modal } from "@components/common";
import { CourseHero, Curriculum, Keypoints } from "@components/course";
import { getAllCourses } from "@content/courses/fetcher";

const Course = ({ course }) => {
  return (
    <div className="relative max-w-7xl mx-auto px-4">
      <CourseHero
        title={course.title}
        description={course.description}
        img={course.coverImage}
      />
      <Keypoints points={course.wsl} />
      <Curriculum locked={true} />
      <Modal />
    </div>
  );
};

export const getStaticPaths = () => {
  const { data } = getAllCourses();
  return {
    paths: data.map((course) => ({
      params: {
        slug: course.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = ({ params }) => {
  const { data } = getAllCourses();
  const course = data.filter((course) => course.slug === params.slug)[0];
  return {
    props: {
      course,
    },
  };
};

export default Course;

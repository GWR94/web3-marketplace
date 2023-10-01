import { useAccount, useOwnedCourse } from "@components/hooks/web3";
import { Message, Modal } from "@components/ui/common";
import { CourseHero, Curriculum, Keypoints } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";

export default function Course({ course }) {
  const { account } = useAccount();
  const { ownedCourse } = useOwnedCourse(course, account.data);
  const courseState = ownedCourse.data?.state;
  return (
    <>
      <div className="py-4">
        <CourseHero
          hasOwner={!!ownedCourse.data}
          title={course.title}
          description={course.description}
          image={course.coverImage}
        />
      </div>
      <Keypoints points={course.wsl} />
      {courseState && (
        <div className="max-w-5xl mx-auto">
          {courseState === "purchased" && (
            <Message type="warning">
              Course is purchased, awaiting activation. This process can take up
              to 24 hours.
              <i className="block font-normal">
                Incase of any queries, please contact info@marketplace.com
              </i>
            </Message>
          )}
          {courseState === "purchased" && (
            <Message type="success">Happy watching!</Message>
          )}
          {courseState === "purchased" && (
            <Message type="danger">
              Course has been deactivated, probably due to incorrect purchase
              data. The functionality to watch the video has been temporarily
              disabled.
              <i className="block font-normal">
                Please contact info@marketplace.com to rectify this.
              </i>
            </Message>
          )}
        </div>
      )}
      <Curriculum locked={true} />
      <Modal />
    </>
  );
}

export function getStaticPaths() {
  const { data } = getAllCourses();

  return {
    paths: data.map((c) => ({
      params: {
        slug: c.slug,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const { data } = getAllCourses();
  const course = data.filter((c) => c.slug === params.slug)[0];

  return {
    props: {
      course,
    },
  };
}

Course.Layout = BaseLayout;

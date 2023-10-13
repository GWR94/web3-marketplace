import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Loader, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

export default function OwnedCourses({ courses }) {
  const router = useRouter();
  const { requireInstall, isLoading } = useWeb3();
  const { account, network } = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data);
  return (
    <>
      <MarketHeader />
      {isLoading ? (
        <Loader />
      ) : (
        <section className="grid grid-cols-1">
          {ownedCourses.isEmpty && (
            <div className="w-100 md:w-1/2">
              <Message type="warning">
                <h3>You don&apos;t own any courses</h3>
                <Link href="/marketplace">
                  <a className="font-normal hover:underline">
                    <i>Purchase Course</i>
                  </a>
                </Link>
              </Message>
            </div>
          )}
          {account.isEmpty && (
            <div className="w-1/2">
              <Message type="warning">
                <div>Please connect to Metamask</div>
              </Message>
            </div>
          )}
          {requireInstall && (
            <div className="w-1/2">
              <Message type="warning">
                <div>Please install Metamask</div>
              </Message>
            </div>
          )}
          {ownedCourses.data?.map((course) => (
            <OwnedCourseCard course={course} key={course.id}>
              <Button onClick={() => router.push(`/courses/${course.slug}`)}>
                Watch the course
              </Button>
            </OwnedCourseCard>
          ))}
        </section>
      )}
    </>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();
  return {
    props: {
      courses: data,
    },
  };
}

OwnedCourses.Layout = BaseLayout;

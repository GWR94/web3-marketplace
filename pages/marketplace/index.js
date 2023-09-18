import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { useWalletInfo } from "@components/hooks/web3";
import { Button } from "@components/ui/common";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { MarketHeader } from "@components/ui/marketplace";
import { useWeb3 } from "@components/providers";

export default function Marketplace({ courses }) {
  const { canPurchase, account } = useWalletInfo();
  const { web3, contract } = useWeb3();

  const [course, setCourse] = useState(null);

  const purchaseCourse = async (order) => {
    const hexCourseId = web3.utils.utf8ToHex(course.id);

    const orderHash = web3.utils.soliditySha3(
      {
        type: "bytes16",
        value: hexCourseId,
      },
      {
        type: "address",
        value: account.data,
      }
    );
    const emailHash = web3.utils.sha3(order.email);

    // emailHash + emailHash
    const proof = web3.utils.soliditySha3(
      {
        type: "bytes32",
        value: emailHash,
      },
      {
        type: "bytes32",
        value: orderHash,
      }
    );

    const price = web3.utils.toWei(String(order.price));

    try {
      const res = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value: price });
      console.log(res);
    } catch (err) {
      // console.error(err);
      console.log("Purchase course: Operation has failed.");
    }
  };

  return (
    <>
      <div className="py-4">
        <MarketHeader />
      </div>
      <CourseList courses={courses}>
        {(course) => (
          <CourseCard
            course={course}
            key={course.id}
            disabled={!canPurchase}
            Footer={() => (
              <div className="mt-4">
                <Button
                  variant="lightPurple"
                  disabled={!canPurchase}
                  onClick={() => setCourse(course)}
                >
                  Purchase
                </Button>
              </div>
            )}
          />
        )}
      </CourseList>
      {course && (
        <OrderModal
          onSubmit={purchaseCourse}
          course={course}
          clearCourse={() => setCourse(null)}
        />
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

Marketplace.Layout = BaseLayout;

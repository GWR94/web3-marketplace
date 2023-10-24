/* eslint-disable no-undef */
import { CourseCard, CourseList } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { Button, Loader } from "@components/ui/common";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { MarketHeader } from "@components/ui/marketplace";
import { useWeb3 } from "@components/providers";
import { withToast } from "@utils/toast";

export default function Marketplace({ courses }) {
  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, account, isConnecting } = useWalletInfo();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { ownedCourses } = useOwnedCourses(courses, account.data);
  const [isNewPurchase, setNewPurchase] = useState(true);

  const purchaseCourse = async (order) => {
    const hexCourseId = web3.utils.utf8ToHex(selectedCourse.id);
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexCourseId },
      { type: "address", value: account.data }
    );

    const value = web3.utils.toWei(String(order.price));
    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash },
        { type: "bytes32", value: orderHash }
      );
      withToast(_purchaseCourse(hexCourseId, proof, value));
    } else {
      withToast(_repurchaseCourse(orderHash, value));
    }
  };

  const _purchaseCourse = async (hexCourseId, proof, value) => {
    try {
      const res = await contract.methods
        .purchaseCourse(hexCourseId, proof)
        .send({ from: account.data, value });
      return res;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const _repurchaseCourse = async (courseHash, value) => {
    try {
      const res = await contract.methods
        .repurchaseCourse(courseHash)
        .send({ from: account.data, value });
      return res;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <>
      <MarketHeader />
      <CourseList courses={courses}>
        {(course) => {
          const owned = ownedCourses.lookup[course.id];
          return (
            <CourseCard
              key={course.id}
              courses={courses}
              state={owned?.state}
              course={course}
              disabled={!hasConnectedWallet}
              Footer={() => {
                if (requireInstall)
                  return (
                    <Button
                      onClick={() => setSelectedCourse(course)}
                      disabled
                      size="sm"
                      variant="lightPurple"
                    >
                      Install
                    </Button>
                  );
                if (isConnecting) {
                  return (
                    <Button
                      onClick={() => setSelectedCourse(course)}
                      disabled
                      size="sm"
                      variant="lightPurple"
                    >
                      <Loader size="sm" />
                    </Button>
                  );
                }
                if (!ownedCourses.hasInitialResponse) {
                  return (
                    <Button size="sm" disabled variant="lightPurple">
                      <Loader size="sm" />
                    </Button>
                  );
                }
                const isBusy = selectedCourse?.id === course.id;
                if (owned) {
                  return owned.state === "deactivated" ? (
                    <Button
                      onClick={() => {
                        setNewPurchase(false);
                        setSelectedCourse(course);
                      }}
                      disabled={isBusy}
                      size="sm"
                      className="ml-1"
                      variant="purple"
                    >
                      {isBusy ? "Repurchasing..." : "Repurchase"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setSelectedCourse(course)}
                      disabled
                      size="sm"
                      variant="green"
                    >
                      Owned
                    </Button>
                  );
                }

                return (
                  <Button
                    onClick={() => setSelectedCourse(course)}
                    disabled={!hasConnectedWallet || isBusy}
                    size="sm"
                    variant="lightPurple"
                  >
                    {isBusy ? "Purchasing..." : "Purchase"}
                  </Button>
                );
              }}
            />
          );
        }}
      </CourseList>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          isNewPurchase={isNewPurchase}
          onSubmit={(order) => purchaseCourse(order)}
          onClose={() => {
            setSelectedCourse(null);
            setNewPurchase(true);
          }}
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

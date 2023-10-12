import { useAdmin, useManagedCourses } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message, VerifyInput } from "@components/ui/common";
import { CourseFilter, ManagedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { useState } from "react";

export default function ManagedCourses() {
  const { web3, contract } = useWeb3();
  const { account } = useAdmin({ redirectTo: "/marketplace" });
  const { managedCourses } = useManagedCourses(account);
  const [proofedOwnership, setProofed] = useState({});

  const verifyCourse = (email, { hash, proof }) => {
    const emailHash = web3.utils.sha3(email);
    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: hash }
    );
    setProofed({
      ...proofedOwnership,
      [hash]: proof === proofToCheck,
    });
  };

  const activateCourse = async (courseHash) => {
    try {
      await contract.methods.activateCourse(courseHash).send({
        from: account.data,
      });
    } catch (e) {
      console.error(e.message);
    }
  };

  const deactivateCourse = async (courseHash) => {
    try {
      await contract.methods.deactivateCourse(courseHash).send({
        from: account.data,
      });
    } catch (e) {
      console.error(e.message);
    }
  };

  if (!account.isAdmin) return null;
  return (
    <>
      <MarketHeader />
      <CourseFilter />
      <section className="grid grid-cols-2">
        {managedCourses.data?.map((course) => (
          <ManagedCourseCard key={course.ownedCourseId} course={course}>
            <VerifyInput
              handleVerifyCourse={(email) => {
                verifyCourse(email, {
                  hash: course.hash,
                  proof: course.proof,
                });
              }}
            />
            {proofedOwnership[course.hash] && (
              <div>
                <Message type="success">Verified</Message>
              </div>
            )}
            {proofedOwnership[course.hash] === false && (
              <div>
                <Message type="danger">Wrong Proof!</Message>
              </div>
            )}
            {course.state === "purchased" && (
              <div className="mt-2">
                <Button
                  variant="green"
                  onClick={() => activateCourse(course.hash)}
                >
                  Activate
                </Button>
                <Button
                  variant="red"
                  onClick={() => deactivateCourse(course.hash)}
                >
                  Deactivate
                </Button>
              </div>
            )}
          </ManagedCourseCard>
        ))}
      </section>
    </>
  );
}

ManagedCourses.Layout = BaseLayout;
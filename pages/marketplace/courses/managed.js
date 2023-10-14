import { useAdmin, useManagedCourses } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Message, VerifyInput } from "@components/ui/common";
import { CourseFilter, ManagedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { normalizeOwnedCourse } from "@utils/normalize";
import { Fragment, useState } from "react";

export default function ManagedCourses() {
  const { web3, contract } = useWeb3();
  const { account } = useAdmin({ redirectTo: "/marketplace" });
  const [searchedCourse, setSearchedCourse] = useState(null);
  const { managedCourses } = useManagedCourses(account);
  const [filter, setFilter] = useState("All");
  const [proofedOwnership, setProofed] = useState({});

  const verifyCourse = (email, { hash, proof }) => {
    if (!email) return;
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

  const renderCard = (course, search = false) => {
    return (
      <div className="flex justify-center w-full lg:w-5/12">
        <ManagedCourseCard
          key={course.ownedCourseId}
          course={course}
          search={search}
        >
          <>
            <p className="text-sm font-medium text-gray-500 mb-2">
              Verify Secret
            </p>
            <VerifyInput
              handleVerifyCourse={(email) => {
                verifyCourse(email, {
                  hash: course.hash,
                  proof: course.proof,
                });
              }}
            />
            {proofedOwnership[course.hash] && (
              <Message type="success">Verified</Message>
            )}
            {proofedOwnership[course.hash] === false && (
              <Message type="danger">Wrong Proof!</Message>
            )}
          </>
        </ManagedCourseCard>
      </div>
    );
  };

  const searchCourse = async (hash) => {
    // hex regex
    const regex = /[0-9A-Fa-f]{6}/g;
    if (hash || hash.length === 66 || regex.test(hash)) {
      const course = await contract.methods.getCourseByHash(hash).call();
      if (course.owner !== "0x0000000000000000000000000000000000000000") {
        const normalized = normalizeOwnedCourse(web3)({ hash }, course);
        setSearchedCourse(normalized);
        return;
      }
    }
    setSearchedCourse(null);
  };

  const filteredCourses = managedCourses.data
    ?.filter((course) => {
      if (filter === "All") return course;
      return course.state === filter.toLowerCase();
    })
    .map((course, i) => <Fragment key={i}>{renderCard(course)}</Fragment>);

  if (!account.isAdmin) return null;
  return (
    <>
      <MarketHeader />
      <div className="flex justify-center items-center">
        <CourseFilter
          onSubmit={searchCourse}
          onFilterSelect={(value) => setFilter(value)}
          filter={filter}
        />
      </div>
      {searchedCourse && (
        <>
          <h1 className="text-2xl font-bold px-5 text-center mb-3">
            Search Result
          </h1>
          <div className="flex-row flex justify-center items-center w-full mb-4">
            {renderCard(searchedCourse, true)}
          </div>
        </>
      )}
      <hr style={{ margin: "20px 0" }} />
      <h1 className="text-2xl font-bold px-5 mb-3 text-center">
        {filter} Courses
      </h1>
      <div className="justify-center items-center w-full flex-wrap gap-5 flex-col lg:flex-row flex mb-5">
        {filteredCourses}
        {!filteredCourses.length && (
          <h1 className="text-lg mt-4 italic">
            There are no {filter.toLowerCase()} courses to show. Please change
            the filter for results to appear.
          </h1>
        )}
      </div>
    </>
  );
}

ManagedCourses.Layout = BaseLayout;

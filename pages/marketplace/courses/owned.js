import { useOwnedCourses } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import { OwnedCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import React from "react";

const OwnedCourses = () => {
  const { ownedCourses } = useOwnedCourses();
  return (
    <>
      {ownedCourses.data}
      <div className="py-4">
        <MarketHeader />
      </div>
      <section className="grid grid-cols-1">
        <OwnedCourseCard>
          <Message>Purchased</Message>
          <Button>Watch The Course</Button>
        </OwnedCourseCard>
      </section>
    </>
  );
};

OwnedCourses.Layout = BaseLayout;

export default OwnedCourses;

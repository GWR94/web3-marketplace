import { useAccount } from "@components/hooks/web3";
import { Button } from "@components/ui/common";
import React from "react";

const ActivationButtons = ({ course }) => {
  const { account } = useAccount();

  const changeCourseState = async (courseHash, method) => {
    try {
      await contract.methods[method](courseHash).send({
        from: account.data,
      });
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <>
      <Button
        variant="green"
        size="sm"
        onClick={() => changeCourseState(course.hash, "activateCourse")}
      >
        Activate
      </Button>
      <Button
        variant="red"
        size="sm"
        onClick={() => changeCourseState(course.hash, "deactivateCourse")}
      >
        Deactivate
      </Button>
    </>
  );
};

export default ActivationButtons;

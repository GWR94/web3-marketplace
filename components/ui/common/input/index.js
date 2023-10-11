import React, { useState } from "react";
import Button from "../button";

const VerifyFilter = ({ handleVerifyCourse }) => {
  const [email, setEmail] = useState("");
  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        type="text"
        name="account"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        id="account"
        className="w-96 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..."
      />
      <Button
        disabled={!email.length}
        onClick={() => handleVerifyCourse(email)}
      >
        Verify
      </Button>
    </div>
  );
};

export default VerifyFilter;

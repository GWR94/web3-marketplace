import React, { useState } from "react";
import Button from "../button";

// BEFORE TX BALANCE => 13839171251600000000
// GAS COST          => 132997 * 20000000000 = 2659940000000000 (0.00265994 ETH)
// GAS + VALUE SENT  => 1.00265994 ETH

// AFTER TX BALANCE  => 12836030071600000000

const VerifyFilter = ({ handleVerifyCourse }) => {
  const [email, setEmail] = useState("");
  return (
    <div className="flex mr-2 mb-4 relative rounded-md">
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

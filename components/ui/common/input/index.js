import React, { useState } from "react";
import Button from "../button";

// BEFORE TX BALANCE => 13839171251600000000
// GAS COST          => 132997 * 20000000000 = 2659940000000000 (0.00265994 ETH)
// GAS + VALUE SENT  => 1.00265994 ETH

// AFTER TX BALANCE  => 12836030071600000000

const VerifyFilter = ({ handleVerifyCourse }) => {
  const [email, setEmail] = useState("");
  return (
    <div className="flex rounded-md">
      <input
        type="text"
        name="account"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        id="account"
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        className="w-full focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="Enter secret (e.g email)..."
      />
      <Button
        disabled={!email.length}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        onClick={() => handleVerifyCourse(email)}
      >
        Verify
      </Button>
    </div>
  );
};

export default VerifyFilter;

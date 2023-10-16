const CourseMarketplace = artifacts.require("CourseMarketplace");
const { catchRevert } = require("../utils/exceptions");

/**
 * Function to get the current wallet balance of the input address in Wei
 * @param {*} addr the chosen address to get the balance for
 * @returns {number}
 */
const getBalance = async (addr) => await web3.eth.getBalance(addr);

/**
 * Function to convert a number into a BigNumber
 * @param {number} value
 * @returns {BigNumber}
 */
const toBn = (value) => web3.utils.toBN(value);

/**
 * Function to retrieve the amount of gas used for the contract function call
 * @param {*} result - result from contract call
 * @returns BigNumber of the amount of gas used for a particular contract fn call
 */
const getGas = async (result) => {
  const tx = await web3.eth.getTransaction(result.tx);
  const gasUsed = toBn(result.receipt.gasUsed);
  const gasPrice = toBn(tx.gasPrice);
  const gas = gasUsed.mul(gasPrice);
  return gas;
};

describe("Course Marketplace Tests", () => {
  contract("CourseMarketplace", (accounts) => {
    const courseId = "0x00000000000000000000000000003130";
    const courseId2 = "0x00000000000000000000000000002130";

    const proof =
      "0x0000000000000000000000000000313000000000000000000000000000003130";
    const proof2 =
      "0x0000000000000000000000000000213000000000000000000000000000002130";
    const value = "1";
    let _contract = null;
    let contractOwner = null;
    let buyer = null;
    let courseHash = null;

    before(async () => {
      _contract = await CourseMarketplace.deployed();
      contractOwner = accounts[0];
      buyer = accounts[1];
    });

    describe("Purchase new course", () => {
      before(async () => {
        await _contract.purchaseCourse(courseId, proof, {
          from: buyer,
          value,
        });
      });

      it("should NOT allow user to repurchase already owned course", async () => {
        await catchRevert(
          _contract.purchaseCourse(courseId, proof, {
            from: buyer,
            value,
          })
        );
      });

      it("can get the purchased course hash by index", async () => {
        const idx = 0;
        courseHash = await _contract.getCourseHashAtIndex(idx);

        const expectedHash = web3.utils.soliditySha3(
          { type: "bytes16", value: courseId },
          { type: "address", value: buyer }
        );

        assert.equal(
          courseHash,
          expectedHash,
          "Course hash is not matching with purchased hash."
        );
      });

      it("should match the data of the course purchased by buyer", async () => {
        const expectIdx = 0;
        const expectedState = 0; // purchased

        const course = await _contract.getCourseByHash(courseHash);
        assert.equal(course.id, expectIdx, "Course index should be 0");
        assert.equal(course.price, value, `Course price should be ${value}`);
        assert.equal(course.proof, proof, `Course proof should be ${proof}`);
        assert.equal(course.owner, buyer, `Owner should be ${buyer}`);
        assert.equal(
          course.state,
          expectedState,
          `Course state should be ${expectedState}`
        );
      });
    });

    describe("Activate the purchase course", () => {
      it("should NOT be able to activate course when user is NOT contract owner", async () => {
        await catchRevert(
          _contract.activateCourse(courseHash, { from: buyer })
        );
      });

      it("should have 'activated' status", async () => {
        await _contract.activateCourse(courseHash, { from: contractOwner });
        const course = await _contract.getCourseByHash(courseHash);
        const expectedState = 1; // activated

        assert.equal(
          course.state,
          expectedState,
          "Course should have 'activated' state"
        );
      });
    });

    describe("Transfer ownership", () => {
      let currentOwner;
      before(async () => {
        currentOwner = await _contract.getContractOwner();
      });
      it("getContractOwner should return deployer address", async () => {
        assert.equal(
          currentOwner,
          contractOwner,
          "Contract owner does not match deployer address"
        );
      });

      it("should NOT allow transfer of ownership if the address is NOT the owners", async () => {
        await catchRevert(
          _contract.transferOwnership(accounts[3], { from: buyer })
        );
      });

      it("should allow transfer of to third account when address is owner", async () => {
        assert.equal(
          currentOwner,
          contractOwner,
          "Contract owner does not match expected address on first instance"
        );
        await _contract.transferOwnership(accounts[2], { from: contractOwner });
        const owner = await _contract.getContractOwner();
        assert.equal(
          owner,
          accounts[2],
          "Contract owner does not match third account after attempted change"
        );
      });

      it("should transfer ownership back to original owner", async () => {
        await _contract.transferOwnership(contractOwner, { from: accounts[2] });
        const owner = await _contract.getContractOwner();
        assert.equal(
          owner,
          currentOwner,
          "Current owner does not match expected owner"
        );
      });
    });

    describe("Deactivate course", () => {
      let courseHash2 = null;
      let currentOwner = null;
      before(async () => {
        await _contract.purchaseCourse(courseId2, proof2, {
          from: buyer,
          value,
        });
        currentOwner = await _contract.getContractOwner();
        courseHash2 = await _contract.getCourseHashAtIndex(1);
      });

      it("should NOT be able to deactivate a course if user is NOT owner", async () => {
        await catchRevert(
          _contract.deactivateCourse(courseHash2, { from: buyer })
        );
      });

      it("should have status of deactivated and price 0", async () => {
        const beforeTXBuyerBalance = await getBalance(buyer);
        const beforeTXContractBalance = await getBalance(_contract.address);
        const beforeTXOwnerBalance = await getBalance(currentOwner);

        const result = await _contract.deactivateCourse(courseHash2, {
          from: contractOwner,
        });

        const gas = await getGas(result);

        const afterTXBuyerBalance = await getBalance(buyer);
        const afterTXContractBalance = await getBalance(_contract.address);
        const afterTXOwnerBalance = await getBalance(currentOwner);

        assert.equal(
          toBn(beforeTXOwnerBalance).sub(gas).toString(),
          afterTXOwnerBalance,
          "Owner balance is not correct"
        );

        assert.equal(
          toBn(beforeTXBuyerBalance).add(toBn(value)).toString(),
          afterTXBuyerBalance,
          "Buyer balance is not correct"
        );

        assert.equal(
          // contract owner pays gas fees, not contract itself
          toBn(beforeTXContractBalance).sub(toBn(value)).toString(),
          afterTXContractBalance,
          "Contract balance is not correct"
        );

        const course = await _contract.getCourseByHash(courseHash2);
        const expectedState = 2; // deactivated

        assert.equal(course.state, expectedState, "Course is not deactivated");
        assert.equal(course.price, 0, "Course price is not 0");
      });

      it("should NOT be able to activate a deactivated course", async () => {
        await catchRevert(
          _contract.activateCourse(courseHash2, { from: contractOwner })
        );
      });
    });

    describe("Repurchase course", async () => {
      let courseHash2 = null;
      before(async () => {
        courseHash2 = await _contract.getCourseHashAtIndex(1);
      });

      it("should NOT repurchase course if course does NOT exist", async () => {
        const nonExistingHash =
          "0x5348fb94a5f97f19ced7d9bcde544e78d4738923635adaf277e6d1421945e580";
        await catchRevert(
          _contract.repurchaseCourse(nonExistingHash, { from: buyer })
        );
      });

      it("should NOT repurchase course if address is not owner", async () => {
        const notOwnerAddress = accounts[2];
        await catchRevert(
          _contract.repurchaseCourse(courseHash2, { from: notOwnerAddress })
        );
      });

      it("should be able to repurchase with original buyer", async () => {
        const beforeTXBuyerBalance = await getBalance(buyer);
        const beforeTXContractBalance = await getBalance(_contract.address);
        const result = await _contract.repurchaseCourse(courseHash2, {
          from: buyer,
          value,
        });
        const afterTXBuyerBalance = await getBalance(buyer);
        const afterTXContractBalance = await getBalance(_contract.address);

        const gas = await getGas(result);
        assert.equal(
          toBn(beforeTXBuyerBalance).sub(gas).sub(toBn(value)).toString(),
          afterTXBuyerBalance,
          "Buyer balance is not correct"
        );

        assert.equal(
          toBn(beforeTXContractBalance).add(toBn(value)).toString(),
          afterTXContractBalance,
          "Contract balance is not correct"
        );

        const course = await _contract.getCourseByHash(courseHash2);
        const expectedState = 0;
        assert.equal(
          course.state,
          expectedState,
          "Course is not in purchased state"
        );
        assert.equal(
          course.price,
          value,
          `Course price is not equal to ${value}`
        );
      });

      it("should NOT be able to repurchase purchased course", async () => {
        await catchRevert(
          _contract.repurchaseCourse(courseHash2, { from: buyer, value })
        );
      });
    });

    describe("Receive funds", () => {
      it("should have transacted funds", async () => {
        const value = "100000000000000000";
        const beforeTxFunds = await getBalance(_contract.address);
        await web3.eth.sendTransaction({
          from: buyer,
          to: _contract.address,
          value,
        });
        const afterTxFunds = await getBalance(_contract.address);
        assert.equal(
          afterTxFunds,
          toBn(beforeTxFunds).add(toBn(value)).toString(),
          "Contract address showing incorrect balance after TX"
        );
      });
    });

    describe("Withdraw funds", () => {
      const value = "100000000000000000";
      const overLimitFunds = "99999900000000000000000";
      let currentOwner;
      before(async () => {
        currentOwner = await _contract.getContractOwner();
        await web3.eth.sendTransaction({
          from: buyer,
          to: _contract.address,
          value,
        });
      });

      it("should fail when withdrawing with NOT owner address", async () => {
        const funds = "10000000000000000";
        await catchRevert(_contract.withdraw(funds, { from: buyer }));
      });

      it("should fail when withdrawing OVER limit funds", async () => {
        await catchRevert(
          _contract.withdraw(overLimitFunds, { from: currentOwner })
        );
      });

      it("should be able to withdraw 0.1 ETH with withdraw", async () => {
        const ownerBeforeTxFunds = await getBalance(currentOwner);
        const contractBeforeTxFunds = await getBalance(_contract.address);
        const result = await _contract.withdraw(value, {
          from: currentOwner,
        });
        const ownerAfterTxFunds = await getBalance(currentOwner);
        const contractAfterTxFunds = await getBalance(_contract.address);
        const gas = await getGas(result);

        assert.equal(
          ownerAfterTxFunds,
          toBn(ownerBeforeTxFunds).sub(gas).add(toBn(value)).toString(),
          "Owner address showing incorrect balance after TX"
        );
        assert.equal(
          contractAfterTxFunds,
          toBn(contractBeforeTxFunds).sub(toBn(value)).toString(),
          "Contract address showing incorrect balance after TX"
        );
      });
    });

    describe("Emergency Withdraw funds", () => {
      let currentOwner;
      before(async () => {
        currentOwner = await _contract.getContractOwner();
      });

      after(async () => {
        await _contract.resumeContract({ from: currentOwner });
      });

      it("should fail when the contract is not stopped", async () => {
        await catchRevert(_contract.emergencyWithdraw({ from: currentOwner }));
      });

      const addedFunds = "100000000000000000"; // 1 ETH

      it("should fail when sender address is NOT owner address", async () => {
        await _contract.stopContract({ from: currentOwner });
        await catchRevert(_contract.emergencyWithdraw({ from: buyer }));
      });

      it("should withdraw all contract funds when sender address is owner", async () => {
        await _contract.stopContract({ from: currentOwner });
        await web3.eth.sendTransaction({
          from: buyer,
          to: _contract.address,
          value: addedFunds,
        });
        const ownerBeforeTxFunds = await getBalance(currentOwner);
        const contractBeforeTxFunds = await getBalance(_contract.address);
        const result = await _contract.emergencyWithdraw({
          from: currentOwner,
        });
        const ownerAfterTxFunds = await getBalance(currentOwner);
        const gas = await getGas(result);

        assert.equal(
          ownerAfterTxFunds,
          toBn(ownerBeforeTxFunds)
            .add(toBn(contractBeforeTxFunds))
            .sub(gas)
            .toString(),
          "Owner address showing incorrect balance after TX"
        );
      });

      it("should have a contract balance of 0", async () => {
        const contractBalance = await getBalance(_contract.address);
        assert.equal(
          toBn(contractBalance),
          0,
          "Contract balance should be zero, it is NOT."
        );
      });
    });

    describe("Self Destruct", () => {
      let currentOwner;
      before(async () => {
        currentOwner = await _contract.getContractOwner();
      });

      it("should fail when the contract is not stopped", async () => {
        await catchRevert(_contract.selfDestruct({ from: currentOwner }));
      });

      const addedFunds = "100000000000000000"; // 1 ETH

      it("should fail when sender address is NOT owner address", async () => {
        await _contract.stopContract({ from: currentOwner });
        await catchRevert(_contract.selfDestruct({ from: buyer }));
      });

      it("should withdraw all contract funds when sender address is owner", async () => {
        // await _contract.stopContract({ from: currentOwner });
        await web3.eth.sendTransaction({
          from: buyer,
          to: _contract.address,
          value: addedFunds,
        });
        const ownerBeforeTxFunds = await getBalance(currentOwner);
        const contractBeforeTxFunds = await getBalance(_contract.address);
        const result = await _contract.selfDestruct({
          from: currentOwner,
        });
        const ownerAfterTxFunds = await getBalance(currentOwner);
        const gas = await getGas(result);

        assert.equal(
          ownerAfterTxFunds,
          toBn(ownerBeforeTxFunds)
            .add(toBn(contractBeforeTxFunds))
            .sub(gas)
            .toString(),
          "Owner address showing incorrect balance after TX"
        );
      });

      it("should have a contract balance of 0", async () => {
        const contractBalance = await getBalance(_contract.address);
        assert.equal(
          toBn(contractBalance),
          0,
          "Contract balance should be zero, it is NOT."
        );
      });

      it("should have 0x bytecode", async () => {
        const code = await web3.eth.getCode(_contract.address);
        assert.equal(code, "0x", "Contract bytecode is not destroyed.");
      });
    });
  });
});

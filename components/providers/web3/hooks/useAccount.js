import { useEffect } from "react";
import useSWR from "swr";

const adminAddr = {
  // keccak256 hash for admin address
  "0xc079959cdc1bc4d9fb5a37c578b2255b9c17918721f1a99809854e59a68da7c0": true,
};
export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => {
      return web3 ? "web3/accounts" : null;
    },
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error(
          "Cannot retrieve an account. Please refresh the browser."
        );
      }

      return account;
    }
  );

  useEffect(() => {
    const mutator = (accounts) => mutate(accounts[0] ?? null);
    provider?.on("accountsChanged", mutator);
    return () => {
      // remove listener when unmounted
      provider?.removeListener("accountsChanged", mutator);
    };
  }, [mutate]);

  return {
    data,
    isAdmin: (data && adminAddr[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest,
  };
};

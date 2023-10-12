import { useEffect } from "react";
import useSWR from "swr";

const adminAddr = {
  // keccak256 hash for admin address
  "0x0e1d86e83e621484e573ac267f80e944ca6d845cf8b2660f2a58df6f92c74e97": true,
};
export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => {
      // if web3 object is available run the query, otherwise return null
      return web3 ? "web3/accounts" : null;
    },
    async () => {
      // get accounts from web3
      const accounts = await web3.eth.getAccounts();
      // retrieve the first account as that will be the one in use
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

  const checkAdmin = () => {
    const keccak = web3.utils.keccak256(data);
    return adminAddr[keccak];
  };

  return {
    data,
    isAdmin: (data && checkAdmin()) ?? false,
    mutate,
    ...rest,
  };
};

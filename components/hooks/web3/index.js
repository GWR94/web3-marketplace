import { useHooks } from "@components/providers/web3";

const enhanceHook = (swrRes) => {
  return {
    ...swrRes,
    hasInitialResponse: swrRes.data || swrRes.error,
  };
};

export const useAccount = () => {
  const account = enhanceHook(useHooks((hooks) => hooks.useAccount)());
  return {
    account,
  };
};

export const useOwnedCourses = () => {
  const res = useHooks((hooks) => hooks.useOwnedCourses)();
  return {
    ownedCourses: { data: res },
  };
};

export const useNetwork = () => {
  const network = enhanceHook(useHooks((hooks) => hooks.useNetwork)());
  return {
    network,
  };
};

export const useWalletInfo = () => {
  const { account } = useAccount();
  const { network } = useNetwork();
  return {
    account,
    network,
    canPurchase: !!(account.data && network.isSupported),
  };
};

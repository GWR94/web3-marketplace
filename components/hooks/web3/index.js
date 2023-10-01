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

export const useOwnedCourses = (...args) => {
  const res = enhanceHook(useHooks((hooks) => hooks.useOwnedCourses)(...args));
  return {
    ownedCourses: { data: res.data },
  };
};

export const useOwnedCourse = (...args) => {
  const res = enhanceHook(useHooks((hooks) => hooks.useOwnedCourse)(...args));
  return {
    ownedCourse: { data: res.data },
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
  const canPurchaseCourse = !!(account.data && network.isSupported);
  return {
    account,
    network,
    canPurchaseCourse,
  };
};

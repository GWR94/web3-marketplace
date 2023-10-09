import { useHooks } from "@components/providers/web3";

const _isEmpty = (data) => {
  return (
    data == null ||
    data === "" ||
    (Array.isArray(data) && data.length === 0) ||
    (data.constructor === Object && Object.keys(data).length === 0)
  );
};
const enhanceHook = (swrRes) => {
  const { data, error } = swrRes;
  const hasInitialResponse = !!(data || error);
  const isEmpty = hasInitialResponse && _isEmpty(data);

  return {
    ...swrRes,
    isEmpty,
    hasInitialResponse,
  };
};

export const useAccount = () => {
  const account = enhanceHook(useHooks((hooks) => hooks.useAccount)());
  return {
    account,
  };
};

export const useOwnedCourses = (...args) => {
  const ownedCourses = enhanceHook(
    useHooks((hooks) => hooks.useOwnedCourses)(...args)
  );
  return {
    ownedCourses,
  };
};

export const useOwnedCourse = (...args) => {
  const ownedCourse = enhanceHook(
    useHooks((hooks) => hooks.useOwnedCourse)(...args)
  );
  return {
    ownedCourse,
  };
};

export const useManagedCourses = (...args) => {
  const managedCourses = enhanceHook(
    useHooks((hooks) => hooks.useManagedCourses)(...args)
  );
  return {
    managedCourses,
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

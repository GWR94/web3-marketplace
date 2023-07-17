const {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} = require("react");
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { setupHooks } from "./hooks/setupHooks";

const Web3Context = createContext(null);

const Web3Provider = ({ children }) => {
  const [web3API, setWeb3API] = useState({
    provider: null,
    web3: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks(),
  });

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3 = new Web3(provider);
        setWeb3API({
          provider,
          web3,
          contract: null,
          isLoading: false,
          hooks: setupHooks(web3, provider),
        });
      } else {
        setWeb3API((api) => ({ ...api, isLoading: false }));
        console.error("Please install Metamask");
      }
    };

    loadProvider();
  }, []);

  const _web3API = useMemo(() => {
    const { web3, provider, isLoading } = web3API;
    return {
      ...web3API,
      requireInstall: !isLoading && !web3,
      connect: provider
        ? async () => {
            try {
              await provider.request({
                method: "eth_requestAccounts",
              });
              console.log("Connected!");
            } catch {
              location.reload();
            }
          }
        : () => {
            console.log("Cannot connect to Metamask. Try reloading browser.");
          },
    };
  }, [web3API]);

  return (
    <Web3Context.Provider value={_web3API}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks(cb) {
  const { hooks } = useWeb3();
  return cb(hooks);
}

export default Web3Provider;

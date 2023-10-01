import { useWalletInfo } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button } from "@components/ui/common";

export default function WalletBar() {
  const { account, network } = useWalletInfo();
  const { requireInstall } = useWeb3();
  return (
    <section className="text-white bg-indigo-600 rounded-lg">
      <div className="p-8">
        <h1 className="text-base xs:text-xl break-words">
          Hello, {account.data?.substring(0, 4)}...
          {account.data?.substring(account.data.length - 4)}.
        </h1>
        <h2 className="subtitle mb-5 text-sm xs:text-base">
          I hope you are having a great day!
        </h2>
        <div className="flex justify-between items-center">
          <div className="sm:flex sm:justify-center lg:justify-start">
            <Button variant="white" className="mr-1 text-sm xs:text-lg p-2">
              Learn how to purchase
            </Button>
          </div>
          <div>
            {requireInstall && (
              <div className="bg-yellow-500 p-4 rounded-lg">
                Cannot connect to network. Please install Metamask.
              </div>
            )}
            {network.hasInitialResponse && !network.isSupported && (
              <div className="bg-red-400 p-4 rounded-lg">
                <div>Connected to wrong network.</div>
                <div>
                  Connect to:{" "}
                  <strong className="text-xl">{network.target}</strong>
                </div>
              </div>
            )}
            {network.data && (
              <div className="ml-2">
                <span>Currently on </span>
                <strong className="text-xl">{network.data}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useWeb3 } from "@components/providers";
import { ActiveLink, Button } from "@components/ui/common";
import { useAccount } from "@components/hooks/web3";

export default function Navbar() {
  const { connect, isLoading, requireInstall } = useWeb3();
  const { account } = useAccount();

  const formatAddress = ({ data, isAdmin }) => {
    if (data)
      return `${data.substring(0, 4)}...${data.substring(data.length - 4)} ${
        isAdmin ? "(A)" : ""
      }`;
  };

  return (
    <section>
      <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
        <nav className="relative" aria-label="Global">
          <div className="flex flex-col xs:flex-row justify-between items-center">
            <div>
              <ActiveLink href="/">
                <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Home
                </a>
              </ActiveLink>
              <ActiveLink href="/marketplace">
                <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Marketplace
                </a>
              </ActiveLink>
              <ActiveLink href="/blog">
                <a className="font-medium mr-8 text-gray-500 hover:text-gray-900">
                  Blog
                </a>
              </ActiveLink>
            </div>
            <div className="text-center">
              <ActiveLink href="/wishlist">
                <a className="font-medium sm:mr-8 mr-2 text-gray-500 hover:text-gray-900">
                  Wishlist
                </a>
              </ActiveLink>
              {isLoading ? (
                <Button disabled disableHover>
                  Loading
                </Button>
              ) : account.data ? (
                <Button disableHover>{formatAddress(account)}</Button>
              ) : requireInstall ? (
                <Button
                  onClick={() =>
                    window.open("https://metamask.io/download", "_blank")
                  }
                >
                  Install Metamask
                </Button>
              ) : (
                <Button onClick={connect}>Connect</Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </section>
  );
}

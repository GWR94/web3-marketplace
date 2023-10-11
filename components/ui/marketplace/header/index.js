import { useAccount, useAdmin } from "@components/hooks/web3";
import { Breadcrumbs } from "@components/ui/common";
import { WalletBar, EthRates } from "@components/ui/web3";
import React from "react";

const LINKS = [
  {
    href: "/marketplace",
    value: "Buy",
  },
  {
    href: "/marketplace/courses/owned",
    value: "My Courses",
  },
  {
    href: "/marketplace/courses/managed",
    value: "Manage Courses",
    requireAdmin: true,
  },
];

const Header = () => {
  const { account } = useAccount();
  return (
    <>
      <div className="pt-4">
        <WalletBar />
      </div>
      <div className="flex align-middle justify-center">
        <EthRates />
      </div>
      <div className="flex flex-row-reverse py-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={LINKS} isAdmin={account.isAdmin} />
      </div>
    </>
  );
};

export { Header as default };

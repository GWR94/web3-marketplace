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
    href: "/marketplace/courses/manage",
    value: "Manage Courses",
  },
];

const Header = () => {
  return (
    <>
      <div className="pt-4">
        <WalletBar />
      </div>
      <div className="flex align-middle justify-center">
        <EthRates />
      </div>
      <div className="flex flex-row-reverse py-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={LINKS} />
      </div>
    </>
  );
};

export { Header as default };

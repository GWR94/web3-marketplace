import { useETHPrice, COURSE_PRICE } from "@components/hooks/useETHPrice";
import { Loader } from "@components/ui/common";
import Image from "next/image";

export default function EthRates() {
  const { eth } = useETHPrice();

  return (
    <div className="flex flex-col xs:flex-row text-center mt-4">
      <div className="p-6 border drop-shadow rounded-md xs:mr-2 my-1">
        <div className="flex item-center justify-center">
          {eth.data ? (
            <>
              <Image
                layout="fixed"
                height="35"
                width="35"
                src="/small-eth.webp"
                alt="Ether"
              />
              <span className="text-lg font-bold">= ${eth.data}</span>
            </>
          ) : (
            <Loader />
          )}
        </div>
        <p className="text-lg text-gray-500">Current ETH Price</p>
      </div>
      <div className="p-6 border drop-shadow rounded-md my-1">
        <div className="flex item-center justify-center">
          {eth.data ? (
            <>
              <span className="text-lg font-bold">{eth.perItem}</span>
              <Image
                layout="fixed"
                height="35"
                width="35"
                src="/small-eth.webp"
                alt="Ether"
              />
              <span className="text-lg font-bold">= ${COURSE_PRICE}</span>
            </>
          ) : (
            <Loader />
          )}
        </div>
        <p className="text-lg text-gray-500">Price per course</p>
      </div>
    </div>
  );
}

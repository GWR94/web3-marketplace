import { useETHPrice, COURSE_PRICE } from "@components/hooks/useETHPrice";
import { Loader } from "@components/ui/common";
import Image from "next/image";

export default function EthRates() {
  const { eth } = useETHPrice();

  return (
    <div className="grid grid-cols-4">
      <div className="flex flex-1 items-stretch text-center">
        <div className="p-10 border drop-shadow rounded-md">
          <div className="flex item-center">
            {eth.data ? (
              <>
                <Image
                  layout="fixed"
                  height="35"
                  width="35"
                  src="/small-eth.webp"
                  alt="Ether"
                />
                <span className="text-2xl font-bold">= ${eth.data}</span>
              </>
            ) : (
              <Loader />
            )}
          </div>
          <p className="text-xl text-gray-500">Current eth Price</p>
        </div>
      </div>
      <div className="flex flex-1 items-stretch text-center">
        <div className="p-10 border drop-shadow orunded-md">
          <div className="flex item-center">
            {eth.data ? (
              <>
                <span className="text-2xl font-bold">{eth.perItem}</span>
                <Image
                  layout="fixed"
                  height="35"
                  width="35"
                  src="/small-eth.webp"
                  alt="Ether"
                />
                <span className="text-2xl font-bold">= {COURSE_PRICE}</span>
              </>
            ) : (
              <Loader />
            )}
          </div>
          <p className="text-xl text-gray-500">Price per course</p>
        </div>
      </div>
    </div>
  );
}

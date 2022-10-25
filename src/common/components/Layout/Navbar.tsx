import { useAccount, useContractRead } from "wagmi";
// import Wallet from "./Wallet";
import { TokenABIConst } from "../../../ethereum/abis/DAObiContract3";
import { toTrimmedAddress } from "@/utils/index";
import { Suspense, useEffect, useState } from "react";
import useRoles from "@/hooks/useRoles";
import Image from "next/image";
import dynamic from "next/dynamic";

const DynamicWallet = dynamic(() => import("./Wallet"), {
  ssr: false,
});

const Navbar = () => {
  const [chancellorAddress, setChancellorAddress] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [userBalance, setUserBalance] = useState(0);

  const { address } = useAccount();
  const { isChancellor, balanceDB, rolesLoading } = useRoles(address);

  const result = useContractRead({
    address:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x82A9313b7D869373E80776e770a9285c2981C018",
    abi: TokenABIConst,
    functionName: "chancellor",
  });

  useEffect(() => {
    if (result.data) {
      setChancellorAddress(result.data);
    }
    if (balanceDB && !rolesLoading) {
      setUserBalance(balanceDB);
    }
  }, [result, balanceDB, rolesLoading]);

  return (
    <nav className="w-full border-b border-color-mode">
      <div className="flex justify-between items-center px-6 py-4 mx-auto max-w-screen-2xl h-16">
        <div className="w-1/3">
          {/* light mode */}
          <div className="relative w-16 h-16 dark:hidden">
            <Image
              src="/logo_light.png"
              alt=""
              layout="fill"
              objectFit="contain"
            />
          </div>
          {/* dark mode */}
          <div className="hidden relative w-16 h-16 dark:flex">
            <Image
              src="/logo_dark.png"
              alt=""
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        <div className="flex justify-center items-center mx-auto space-x-3 w-1/3 text-center whitespace-nowrap">
          <div className="hidden flex-col justify-center items-center lg:flex">
            <p>
              Today&#39;s Chancellor is{" "}
              <a
                href={`https://mumbai.polygonscan.com/address/${chancellorAddress}`}
              >
                {toTrimmedAddress(chancellorAddress as string)}
              </a>
            </p>
            <div className="hidden whitespace-nowrap md:inline">
              {`${
                !rolesLoading && isChancellor
                  ? "👑 Welcome Chancellor! 🏰"
                  : "🌾 Maybe One Day... 🌾"
              }
              `}
            </div>
          </div>
        </div>
        <div className="flex items-center mr-0 w-2/3 text-right md:w-1/3">
          <div className="inline-block w-1/3">{`${userBalance}`} $DB</div>
          <DynamicWallet />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

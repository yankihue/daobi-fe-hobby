import { useAccount, useContractRead } from "wagmi";
import Wallet from "./Wallet";
import Contract3ABI from "../../../ethereum/abis/DAObiContract3.json";
import { toTrimmedAddress } from "@/utils/index";
import { useEffect, useState } from "react";
import useRoles from "@/hooks/useRoles";

const Navbar = () => {
  const { address } = useAccount();
  const result = useContractRead({
    address:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x68af95a6f932a372e88170e9c2a46094FAeFd5D4",
    abi: [...Contract3ABI] as const,
    functionName: "chancellor",
  });

  const [chancellorAddress, setChancellorAddress] = useState("");
  useEffect(() => {
    if (result.data) {
      setChancellorAddress(result.data as string);
    }
  }, [result]);

  const { isChancellor, rolesLoading } = useRoles(address);

  return (
    <nav className="flex justify-between justify-self-start items-center px-6 py-4 mb-4 w-full max-w-full h-full max-h-16 border-b border-color-mode">
      <div className="w-1/3">
        <h1 className="text-left">DAObi</h1>
      </div>
      <div className="flex justify-center items-center mx-auto space-x-3 w-1/3 text-center whitespace-nowrap">
        <div className="hidden flex-col justify-center items-center lg:flex">
          <p>
            Today&#39;s Chancellor is{" "}
            <a
              href={`https://mumbai.polygonscan.com/address/${chancellorAddress}`}
            >
              {toTrimmedAddress(result.data as unknown as string)}
            </a>
          </p>
          <div className="hidden whitespace-nowrap md:inline">
            {!rolesLoading &&
              `${
                isChancellor
                  ? "👑 Welcome Chancellor! 🏰"
                  : "🌾 Maybe One Day... 🛖"
              }
            `}
          </div>
        </div>
      </div>
      <div className="mr-0 w-1/3 text-right">
        <Wallet />
      </div>
    </nav>
  );
};

export default Navbar;

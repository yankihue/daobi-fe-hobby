import { DAOBI_CONTRACT } from "@/ethereum/abis";
import useRoles from "@/hooks/useRoles";
import { toTrimmedAddress } from "@/utils/index";
import { JsonFragment } from "@ethersproject/abi";
import { useAccount } from "wagmi";
import Function from "./Function";

const chancellorOnlyMethods = ["claimChancellorSalary", "recoverSeal", "mint"];

const Contract = ({ name, address, ABI, visibleMethods }: DAOBI_CONTRACT) => {
  const { address: userAddress, isConnected, connector } = useAccount();
  const { isChancellor } = useRoles(userAddress);

  // get functions from abi
  const allContractFunctions = ABI.filter(
    (method) => method.type === "function" && method?.name
  );

  const callableContractFunctions = [];
  visibleMethods.forEach((methodName) => {
    // filter out important functions
    let method: JsonFragment = {};

    allContractFunctions.map((func) => {
      if (func.name === methodName) {
        method = { ...func };
      }
    });
    // if function requires being Chancellor...
    if (chancellorOnlyMethods.includes(methodName)) {
      // only show to Chancellor
      if (isChancellor) callableContractFunctions.push(method);
    } else callableContractFunctions.push(method);
  });

  return (
    <div className="w-full h-full">
      <div className="mx-auto mt-2 mb-4 text-center">
        {`Methods for ${name}`}
        <br />
        <a
          className="mx-auto w-min text-sm underline hover:cursor-pointer"
          href={`https://mumbai.polygonscan.com/address/${address}`}
        >
          View {toTrimmedAddress(address)} on BlockExplorer
        </a>
        <br />
      </div>
      {/* show each function if acct is connected  */}
      <div className="flex flex-col gap-4 mx-1 md:mx-16 xl:mx-32 2xl:mx-64 md:grid md:grid-cols-2 xl:grid-cols-3">
        {isConnected &&
          connector &&
          callableContractFunctions.map((func, idx) => {
            return (
              <Function
                key={`${func?.name}-${address}-${idx}`}
                name={func?.name}
                stateMutability={func?.stateMutability}
                inputs={func?.inputs}
                outputs={func?.outputs}
                contractABI={ABI}
                contractAddress={address}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Contract;

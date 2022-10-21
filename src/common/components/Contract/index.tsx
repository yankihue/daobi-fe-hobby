import { DAOBI_CONTRACT } from "@/ethereum/abis";
import useRoles from "@/hooks/useRoles";
import { toTrimmedAddress } from "@/utils/index";
import { JsonFragment } from "@ethersproject/abi";
import { useAccount } from "wagmi";
import Function from "./Function";
import Section from "./Section";

const chancellorOnlySections = ["claimChancellorSalary", "recoverSeal", "mint"];

const Contract = ({
  address,
  ABI,
  heading,
  userFriendlySections,
}: DAOBI_CONTRACT) => {
  const { address: userAddress, isConnected, connector } = useAccount();
  const { isChancellor } = useRoles(userAddress);

  // const contractSections = [];
  // Object.values(userFriendlySections).forEach((section) => {
  //   // filter out important functions
  //   let methodABI: JsonFragment = {};

  //   allContractFunctions.map((func) => {
  //     if (func.name === methodName) {
  //       methodABI = { ...func };
  //     }
  //   });
  //   // if function requires being Chancellor...
  //   if (chancellorOnlyMethods.includes(methodName)) {
  //     // only show to Chancellor
  //     if (isChancellor) contractSections.push(methodABI);
  //   } else contractSections.push(methodABI);
  // });

  return (
    <div className="w-full h-full">
      <div className="mx-auto mt-2 mb-4 text-center">
        {/* {`${heading}`} */}
        <a
          className="mx-auto w-min text-base underline hover:cursor-pointer"
          href={`https://mumbai.polygonscan.com/address/${address}`}
        >
          Records of the Official Polygonscan Historian
          {/* View {toTrimmedAddress(address)} on BlockExplorer */}
        </a>
      </div>
      {/* show each function if acct is connected  */}
      <div
        className="flex flex-col gap-4 mx-1 md:mx-16 xl:mx-32 2xl:mx-64" /* md:grid md:grid-cols-2 xl:grid-cols-3 */
      >
        {isConnected &&
          connector &&
          Object.entries(userFriendlySections).map(
            ([section, { title, methods }]) => {
              let visibleToUser = true;
              // if function requires being Chancellor...
              if (chancellorOnlySections.includes(section)) {
                // only show to Chancellor
                if (!isChancellor) visibleToUser = false;
              }

              return (
                <>
                  {visibleToUser && (
                    <Section
                      key={title}
                      contractAddress={address}
                      contractABI={ABI}
                      title={title}
                      methods={methods}
                      // name={func?.name}
                      // stateMutability={func?.stateMutability}
                      // inputs={func?.inputs}
                      // outputs={func?.outputs}
                      // contractABI={ABI}
                      // contractAddress={address}
                    />
                  )}
                </>
              );
            }
          )}
      </div>
    </div>
  );
};

export default Contract;

import { DAOBI_CONTRACT } from "@/ethereum/abis";
import useRoles from "@/hooks/useRoles";
import { useAccount } from "wagmi";
import Section from "./Section";

const hiddenSections = ["registration", "makeClaim"];
const chancellorOnlySections = ["claimChancellorSalary", "recoverSeal", "mint"];

const Contract = ({ address, ABI, userFriendlySections }: DAOBI_CONTRACT) => {
  const { address: userAddress, isConnected, connector } = useAccount();
  const { isChancellor } = useRoles(userAddress);

  return (
    <div className="mt-2 w-full h-full">
      {/* show each function if acct is connected  */}
      <div className="flex flex-col mx-1 md:mx-16 xl:mx-32 2xl:mx-64">
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
              if (hiddenSections.includes(section)) visibleToUser = false;
              return (
                <>
                  {visibleToUser && (
                    <Section
                      key={title}
                      contractAddress={address}
                      contractABI={ABI}
                      title={title}
                      methods={methods}
                    />
                  )}
                </>
              );
            }
          )}
      </div>
      <div className="mx-auto mt-8 text-center">
        <a
          className="mx-auto w-min text-base underline hover:cursor-pointer"
          href={`https://polygonscan.com/address/${address}`}
          target={"_blank"}
          rel={"noopener noreferrer"}
        >
          Records of the Official Polygonscan Historian
        </a>
      </div>
    </div>
  );
};

export default Contract;

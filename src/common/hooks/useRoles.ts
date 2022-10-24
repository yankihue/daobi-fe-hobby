import { BigNumber } from "ethers";
import { useContractRead } from "wagmi";
import Contract3ABI from "../../ethereum/abis/DAObiContract3.json";
import VoteABI from "../../ethereum/abis/DaobiVoteContract.json";

const useRoles = (userAddress: string) => {
  // check if address owns voting token
  // if they do, they've verified on twitter already
  const {
    data: votingTokenBalance,
    isError: isVerifiedError,
    isLoading: isVerifiedLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_VOTE_ADDR ??
      "0xbb1AE89B97134a753D1852A83d7eE15Ed1C46DE0",
    abi: [...VoteABI] as const,
    functionName: "balanceOf",
    args: [userAddress],
  });

  // get address' Voter Struct from Voter Registry Mapping
  const {
    data: voterStruct,
    isError: isRegisteredError,
    isLoading: isRegisteredLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_VOTE_ADDR ??
      "0xbb1AE89B97134a753D1852A83d7eE15Ed1C46DE0",
    abi: [...VoteABI] as const,
    functionName: "voterRegistry",
    args: [userAddress],
  });

  const {
    data: chancellorAddress,
    isError: isChancellorError,
    isLoading: isChancellorLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x82A9313b7D869373E80776e770a9285c2981C018",
    abi: [...Contract3ABI] as const,
    functionName: "chancellor",
  });

  return {
    // check if user completed twitter verification
    isVerified: (votingTokenBalance as unknown as BigNumber)?.gt(0),
    // check if user registered to vote / claimed username
    isRegistered: voterStruct?.["serving"],
    // check if user is Chancellor
    isChancellor: (chancellorAddress as unknown as string) === userAddress,
    currentChancellor: chancellorAddress,
    rolesLoading:
      isChancellorLoading || isVerifiedLoading || isRegisteredLoading,
    rolesErrors:
      isChancellorError || isVerifiedError || isRegisteredError
        ? [isChancellorError, isVerifiedError, isRegisteredError]
        : null,
  };
};

export default useRoles;

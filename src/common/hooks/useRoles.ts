import { BigNumber, BigNumberish, ethers } from "ethers";
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
    staleTime: 10000,
    watch: true,
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
    staleTime: 30000,
    watch: true,
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
    staleTime: 30000,
  });

  const {
    data: balanceDB,
    isError: isBalanceDBError,
    isLoading: isBalanceDBLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x82A9313b7D869373E80776e770a9285c2981C018",
    abi: [...Contract3ABI] as const,
    functionName: "balanceOf",
    args: [userAddress],
    staleTime: 5000,
    watch: true,
  });

  return {
    // check if user completed twitter verification
    isVerified: (votingTokenBalance as BigNumber)?.gt(0),
    // check if user registered to vote / claimed username
    isRegistered: voterStruct?.["serving"],
    // check if user is Chancellor
    isChancellor: (chancellorAddress as string) === userAddress,
    balanceDB: Number(
      ethers.utils?.formatEther((balanceDB as BigNumberish) ?? 0)
    ),
    currentChancellor: chancellorAddress,
    rolesLoading:
      isChancellorLoading ||
      isVerifiedLoading ||
      isRegisteredLoading ||
      isBalanceDBLoading,
    rolesErrors:
      isChancellorError ||
      isVerifiedError ||
      isRegisteredError ||
      isBalanceDBError
        ? [
            isChancellorError,
            isVerifiedError,
            isRegisteredError,
            isBalanceDBError,
          ]
        : null,
  };
};

export default useRoles;

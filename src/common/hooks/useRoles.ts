import { useContractRead } from "wagmi";
import { TokenABIConst } from "@/ethereum/abis/DAObiContract3";
import { VoteABIConst } from "@/ethereum/abis/DAObiVoteContract";
import { formatEther } from "ethers/lib/utils";

const useRoles = (userAddress: `0x${string}`) => {
  /** Token Contract Roles */
  const {
    data: currentChancellor,
    isError: chanceAddrError,
    isLoading: chanceAddrLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x82A9313b7D869373E80776e770a9285c2981C018",
    abi: TokenABIConst,
    functionName: "chancellor",
    staleTime: 10000,
  });

  // check if user is Chancellor
  const isChancellor = !chanceAddrLoading && currentChancellor === userAddress;

  const {
    data: bigNumberDB,
    isError: isBalanceDBError,
    isLoading: isBalanceDBLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x82A9313b7D869373E80776e770a9285c2981C018",
    abi: TokenABIConst,
    functionName: "balanceOf",
    args: [userAddress],
    staleTime: 10000,
    watch: true,
  });

  // get user's balance of $DB
  const balanceDB = Number(formatEther?.(bigNumberDB ?? 0));

  /** Voting Contract Roles */
  const {
    data: voteTokenBalance,
    isError: voteTokenError,
    isLoading: voteTokenLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_VOTE_ADDR ??
      "0xbb1AE89B97134a753D1852A83d7eE15Ed1C46DE0",
    abi: VoteABIConst,
    functionName: "balanceOf",
    args: [userAddress],
    staleTime: 10000,
    watch: true,
  });

  // check if user owns voting token
  // if they do, they've verified on twitter already
  const isVerified = voteTokenBalance?.gt(0);

  const {
    data: userVoterStruct,
    isError: userStructError,
    isLoading: userStructLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_VOTE_ADDR ??
      "0xbb1AE89B97134a753D1852A83d7eE15Ed1C46DE0",
    abi: VoteABIConst,
    functionName: "voterRegistry",
    args: [userAddress],
    staleTime: 10000,
    watch: true,
  });

  // check if user registered to vote / claimed username
  const isRegistered = userVoterStruct?.["serving"];

  const {
    data: chancellorVoterStruct,
    isError: chanceStructError,
    isLoading: chanceStructLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_VOTE_ADDR ??
      "0xbb1AE89B97134a753D1852A83d7eE15Ed1C46DE0",
    abi: VoteABIConst,
    functionName: "voterRegistry",
    args: [currentChancellor],
    staleTime: 10000,
    watch: true,
  });

  // check if user has more votes than current chancellor
  const canClaimChancellor = (): boolean => {
    if (chanceStructLoading || userStructLoading) return false;
    // if already chancellor, can't claim again
    if (isChancellor) return false;
    // not enough tokens
    if (!isVerified || balanceDB < 1) return false;

    return userVoterStruct?.["votesAccrued"]?.gt(
      chancellorVoterStruct?.["votesAccrued"]
    );
  };

  return {
    isVerified,
    isRegistered,
    isChancellor,
    canClaimChancellor: canClaimChancellor(),
    balanceDB,
    currentChancellor,
    rolesLoading:
      chanceAddrLoading ||
      voteTokenLoading ||
      userStructLoading ||
      isBalanceDBLoading ||
      chanceStructLoading,
    rolesErrors:
      chanceAddrError ||
      voteTokenError ||
      userStructError ||
      isBalanceDBError ||
      chanceStructError
        ? [
            chanceAddrError,
            voteTokenError,
            userStructError,
            isBalanceDBError,
            chanceStructError,
          ]
        : null,
  };
};

export default useRoles;

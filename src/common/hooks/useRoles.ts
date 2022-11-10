import { useContractRead } from "wagmi";
import { TokenABIConst } from "@/ethereum/abis/DAObiContract3";
import { VoteABIConst } from "@/ethereum/abis/DAObiVoteContract";
import { formatEther, parseBytes32String } from "ethers/lib/utils";
import { useEffect, useState } from "react";

const useRoles = (userAddress: `0x${string}`) => {
  /** Token Contract Roles */
  const {
    data: chancellorAddr,
    isError: chanceAddrError,
    isLoading: chanceAddrLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x5988Bf243ADf1b42a2Ec2e9452D144A90b1FD9A9",
    abi: TokenABIConst,
    functionName: "chancellor",
    staleTime: 10000,
  });

  const [chanceAddr, setChanceAddr] = useState("");
  const [isChancellor, setIsChancellor] = useState(false);
  useEffect(() => {
    if (!chanceAddrLoading) {
      // check if user is Chancellor
      let bool = chancellorAddr === userAddress;
      if (bool !== isChancellor) setIsChancellor(bool);

      if (chancellorAddr !== chanceAddr) setChanceAddr(chancellorAddr);
    }
  }, [
    chanceAddr,
    chanceAddrLoading,
    chancellorAddr,
    isChancellor,
    userAddress,
  ]);

  const {
    data: bigNumberDB,
    isError: isBalanceDBError,
    isLoading: isBalanceDBLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x5988Bf243ADf1b42a2Ec2e9452D144A90b1FD9A9",
    abi: TokenABIConst,
    functionName: "balanceOf",
    args: [userAddress],
    staleTime: 10000,
    watch: true,
  });

  const [balanceDB, setBalanceDB] = useState(0);
  useEffect(() => {
    if (!isBalanceDBLoading) {
      // get user's balance of $DB
      let bal = Number(formatEther?.(bigNumberDB ?? 0));
      if (bal !== balanceDB) setBalanceDB(bal);
    }
  }, [balanceDB, bigNumberDB, isBalanceDBLoading]);

  /** Voting Contract Roles */
  const {
    data: voteTokenBalance,
    isError: voteTokenError,
    isLoading: voteTokenLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_VOTE_ADDR ??
      "0xe8A858B29311652F7e2170118FbEaD34d097e88A",
    abi: VoteABIConst,
    functionName: "balanceOf",
    args: [userAddress],
    staleTime: 10000,
    watch: true,
  });

  const [hasVoteToken, setHasVoteToken] = useState(false);
  useEffect(() => {
    if (!voteTokenLoading) {
      // check if user owns voting token
      // if they do, they've verified on twitter already
      let hasToken = voteTokenBalance?.gt(0);
      if (hasToken !== hasVoteToken) setHasVoteToken(hasToken);
    }
  }, [hasVoteToken, voteTokenBalance, voteTokenLoading]);

  const {
    data: userVoterStruct,
    isError: userStructError,
    isLoading: userStructLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_VOTE_ADDR ??
      "0xe8A858B29311652F7e2170118FbEaD34d097e88A",
    abi: VoteABIConst,
    functionName: "voterRegistry",
    args: [userAddress],
    staleTime: 10000,
    watch: true,
  });

  const [isReclused, setIsReclused] = useState(false);
  const [isImmolated, setIsImmolated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userCourtName, setUserCourtName] = useState("");
  useEffect(() => {
    if (!userStructLoading) {
      let hasUsername = false;
      let courtName = "";
      let reclused = false;
      let immolated = false;

      // check if user registered to vote / claimed username
      try {
        courtName = parseBytes32String?.(userVoterStruct?.["courtName"]);
      } catch (error) {}

      if (courtName !== "") {
        hasUsername = true;

        // check if user is reclused/immolated
        // cast to string to make sure its non null
        if (userVoterStruct?.serving?.toString() === "false") {
          if (hasVoteToken) {
            // if user isnt serving & has DBVT they are reclused
            reclused = true;
          } else {
            // if user isnt serving & has 0 DBVT they have self-immolated
            immolated = true;
          }
        }
      }

      if (hasUsername !== isRegistered) setIsRegistered(hasUsername);
      if (courtName !== userCourtName) setUserCourtName(courtName);
      if (reclused !== isReclused) setIsReclused(reclused);
      if (immolated !== isImmolated) setIsImmolated(immolated);
    }
  }, [
    hasVoteToken,
    isImmolated,
    isReclused,
    isRegistered,
    userCourtName,
    userStructLoading,
    userVoterStruct,
  ]);

  const {
    data: chancellorVoterStruct,
    isError: chanceStructError,
    isLoading: chanceStructLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_VOTE_ADDR ??
      "0xe8A858B29311652F7e2170118FbEaD34d097e88A",
    abi: VoteABIConst,
    functionName: "voterRegistry",
    args: [chancellorAddr],
    staleTime: 10000,
    watch: true,
  });

  const [canClaim, setCanClaim] = useState(false);
  const [chanceName, setChanceName] = useState("");
  useEffect(() => {
    const canClaimChancellor = (): boolean => {
      // if already chancellor, can't claim again
      if (isChancellor) return false;
      // not enough tokens
      if (!hasVoteToken || balanceDB < 1) return false;
      // chancellor is not serving & user has a vote
      if (
        chancellorVoterStruct?.serving?.toString() === "false" &&
        userVoterStruct?.["votesAccrued"]?.gt(0)
      ) {
        return true;
      }

      // userVotes > chanceVotes
      return userVoterStruct?.["votesAccrued"]?.gt(
        chancellorVoterStruct?.["votesAccrued"]
      );
    };

    if (!chanceStructLoading) {
      let courtName = "";
      try {
        courtName = parseBytes32String?.(chancellorVoterStruct?.["courtName"]);
      } catch (error) {}

      if (courtName !== chanceName) setChanceName(courtName);

      // check if user has more votes than current chancellor
      let bool = canClaimChancellor();
      if (bool !== canClaim) setCanClaim(bool);
    }
  }, [
    balanceDB,
    canClaim,
    chanceName,
    chanceStructLoading,
    chancellorVoterStruct,
    isChancellor,
    hasVoteToken,
    userVoterStruct,
  ]);

  return {
    hasVoteToken,
    isRegistered,
    isReclused,
    isImmolated,
    isChancellor,
    canClaimChancellor: canClaim,
    balanceDB,
    currentChancellor: {
      address: chanceAddr,
      courtName: chanceName,
    },
    userCourtName,
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

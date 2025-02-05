import { useContractRead } from "wagmi";
import { TokenABIConst } from "@/ethereum/abis/DAObiContract3";
import { VoteABIConst } from "@/ethereum/abis/DAObiVoteContract";
import { formatEther, parseBytes32String } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { DaobiAccountability } from "@/ethereum/abis/DaobiAccountability";
import { BigNumber } from "ethers";

const useRoles = (userAddress: `0x${string}`) => {
  const [chanceAddr, setChanceAddr] = useState("");
  const [isChancellor, setIsChancellor] = useState(false);
  const [hasGrudge, setHasGrudge] = useState(false);
  const [accuser, setAccuser] = useState("");
  const [accusationTracker, setAccusationTracker] = useState("");
  const [isRingLeader, setIsRingLeader] = useState(false);
  const [numSupporters, setNumSupporters] = useState(0);
  const [balanceDB, setBalanceDB] = useState(0);
  const [hasVoteToken, setHasVoteToken] = useState(false);
  const [isServing, setIsServing] = useState(false);
  const [isReclused, setIsReclused] = useState(false);
  const [isImmolated, setIsImmolated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userCourtName, setUserCourtName] = useState("");
  const [canClaim, setCanClaim] = useState(false);
  const [chanceName, setChanceName] = useState("");
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
  });

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
  });

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
  });

  const {
    data: hasGrudgeStruct,
    isError: hasGrudgeStructError,
    isLoading: hasGrudgeStructLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_BANISHMENT_ADDR ??
      "0x397D5bA2F608A6FE51aD11DA0eA9c0eE09890D4e",
    abi: DaobiAccountability,
    functionName: "grudgeBook",
    args: [userAddress],
    staleTime: 10000,
  });

  const {
    data: accusationTrackerStruct,
    isError: accusationTrackerError,
    isLoading: accusationTrackerLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_BANISHMENT_ADDR ??
      "0x397D5bA2F608A6FE51aD11DA0eA9c0eE09890D4e",
    abi: DaobiAccountability,
    functionName: "accusationTracker",
    args: [userAddress],
    staleTime: 10000,
  });
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
  });
  const {
    data: isAccuserStruct,
    isError: isAccuserError,
    isLoading: isAccuserLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_BANISHMENT_ADDR ??
      "0x397D5bA2F608A6FE51aD11DA0eA9c0eE09890D4e",
    abi: DaobiAccountability,
    functionName: "getAccuser",
    args: [accusationTracker as `0x${string}`],
    staleTime: 10000,
  });
  const {
    data: numSupportersStruct,
    isError: numSupportersError,
    isLoading: numSupportersLoading,
  } = useContractRead({
    address:
      process.env.NEXT_PUBLIC_BANISHMENT_ADDR ??
      "0x397D5bA2F608A6FE51aD11DA0eA9c0eE09890D4e",
    abi: DaobiAccountability,
    functionName: "getNumSupporters",
    args: [accusationTracker as `0x${string}`],
    staleTime: 10000,
  });

  useEffect(() => {
    if (!chanceAddrLoading) {
      // check if user is Chancellor
      let bool = chancellorAddr === userAddress;
      if (bool !== isChancellor) setIsChancellor(bool);

      if (chancellorAddr !== chanceAddr) setChanceAddr(chancellorAddr);
    }
    if (!isBalanceDBLoading) {
      // get user's balance of $DB
      let bal = Number(formatEther?.(bigNumberDB ?? 0));
      if (bal !== balanceDB) setBalanceDB(bal);
    }
    if (!voteTokenLoading) {
      // check if user owns voting token
      // if they do, they've verified on twitter already
      let hasToken = voteTokenBalance?.gt(0);
      if (hasToken !== hasVoteToken) setHasVoteToken(hasToken);
    }
    if (!userStructLoading) {
      let courtName = "";
      let serving = false;
      let reclused = false;
      let immolated = false;

      // parse username
      try {
        courtName = parseBytes32String?.(userVoterStruct?.["courtName"]);
      } catch (error) {}

      // check status
      if (userVoterStruct?.serving) {
        serving = true;
      }

      // user is registered if any are true: serving=true, courtName!=null, has DBVT
      const registered = serving || courtName !== "" || hasVoteToken;

      // check if user is reclused/immolated
      if (!serving) {
        if (hasVoteToken && courtName !== "") {
          // if user isnt serving & is still otherwise registered they are reclused
          reclused = true;
        }

        if (!hasVoteToken && courtName !== "") {
          immolated = true;
        }
      }

      if (serving !== isServing) setIsServing(serving);
      if (registered !== isRegistered) setIsRegistered(registered);
      if (courtName !== userCourtName) setUserCourtName(courtName);
      if (reclused !== isReclused) setIsReclused(reclused);
      if (immolated !== isImmolated) setIsImmolated(immolated);
    }
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
    let grudge = false;

    if (!hasGrudgeStructLoading) {
      if (grudge !== hasGrudge) setHasGrudge(hasGrudge);
    }
    if (!hasGrudgeStructLoading) {
      if (
        hasGrudgeStruct?.accuser != "0x0000000000000000000000000000000000000000"
      ) {
        setHasGrudge(true);
        setAccuser(hasGrudgeStruct?.accuser);
      }
    }

    setAccusationTracker(accusationTrackerStruct);
    setIsRingLeader(isAccuserStruct === userAddress);
    setNumSupporters(numSupportersStruct?.toNumber());
  }, [
    chanceAddr,
    chanceAddrLoading,
    chancellorAddr,
    isChancellor,
    userAddress,
    balanceDB,
    bigNumberDB,
    isBalanceDBLoading,
    hasVoteToken,
    voteTokenBalance,
    voteTokenLoading,
    isImmolated,
    isServing,
    isReclused,
    isRegistered,
    userCourtName,
    userStructLoading,
    userVoterStruct,
    canClaim,
    chanceName,
    chanceStructLoading,
    chancellorVoterStruct,
    isChancellor,
    hasGrudgeStruct,
    accusationTrackerStruct,
    isAccuserStruct,
    hasGrudge,
    hasGrudgeStructLoading,
  ]);

  return {
    hasVoteToken,
    isRegistered,
    isServing,
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
      chanceStructLoading ||
      hasGrudgeStructLoading ||
      accusationTrackerLoading ||
      isAccuserLoading ||
      numSupportersLoading,
    rolesErrors:
      chanceAddrError ||
      voteTokenError ||
      userStructError ||
      isBalanceDBError ||
      chanceStructError ||
      hasGrudgeStructError ||
      accusationTrackerError ||
      isAccuserError ||
      numSupportersError
        ? [
            chanceAddrError,
            voteTokenError,
            userStructError,
            isBalanceDBError,
            chanceStructError,
            hasGrudgeStructError,
            accusationTrackerError,
            isAccuserError,
            numSupportersError,
          ]
        : null,
    hasGrudge,
    accuser,
    accusationTracker,
    isRingLeader,
    numSupporters,
  };
};

export default useRoles;

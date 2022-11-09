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

  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    if (!voteTokenLoading) {
      // check if user owns voting token
      // if they do, they've verified on twitter already
      let bool = voteTokenBalance?.gt(0);
      if (bool !== isVerified) setIsVerified(bool);
    }
  }, [isVerified, voteTokenBalance, voteTokenLoading]);

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

  const [isRegistered, setIsRegistered] = useState(false);
  const [userCourtName, setUserCourtName] = useState("");
  useEffect(() => {
    if (!userStructLoading) {
      let bool = false;
      let courtName = "";

      // check if user registered to vote / claimed username
      try {
        courtName = parseBytes32String?.(userVoterStruct?.["courtName"]);
      } catch (error) {}
      if (courtName !== "") {
        bool = true;
      }

      if (bool !== isRegistered) setIsRegistered(bool);
      if (courtName !== userCourtName) setUserCourtName(courtName);
    }
  }, [isRegistered, userCourtName, userStructLoading, userVoterStruct]);

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
      if (!isVerified || balanceDB < 1) return false;

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
    isVerified,
    userVoterStruct,
  ]);

  return {
    isVerified,
    isRegistered,
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

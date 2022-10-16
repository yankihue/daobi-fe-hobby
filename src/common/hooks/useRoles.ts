import { useContractRead } from "wagmi";
import Contract3ABI from "../../ethereum/abis/DAObiContract3.json";
import VoteABI from "../../ethereum/abis/DaobiVoteContract.json";

const useRoles = (userAddress: string) => {
  // get address' Voter Struct from Voter Registry Mapping
  const {
    data: voterStruct,
    isError: isVerifiedError,
    isLoading: isVerifiedLoading,
  } = useContractRead({
    addressOrName:
      process.env.NEXT_PUBLIC_VOTE_ADDR ??
      "0xdB22a7D54504Cba851d2dbdC1b354B8C1B3E64D5",
    contractInterface: VoteABI,
    functionName: "voterRegistry",
    args: [userAddress],
  });

  const {
    data: chancellorAddress,
    isError: isChancellorError,
    isLoading: isChancellorLoading,
  } = useContractRead({
    addressOrName:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x68af95a6f932a372e88170e9c2a46094FAeFd5D4",
    contractInterface: Contract3ABI,
    functionName: "chancellor",
  });

  return {
    // check if user verified on twitter
    isVerified: voterStruct?.["serving"],
    // check if user is Chancellor
    isChancellor: (chancellorAddress as unknown as string) === userAddress,
    rolesLoading: isChancellorLoading || isVerifiedLoading,
    rolesErrors:
      isChancellorError || isVerifiedError
        ? [isChancellorError, isVerifiedError]
        : null,
  };
};

export default useRoles;

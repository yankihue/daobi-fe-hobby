import Contract3 from "./DAObiContract3.json";
import ChancellorsSeal from "./DaobiChancellorsSeal.json";
import VoteContract from "./DaobiVoteContract.json";

import { JsonFragment } from "@ethersproject/abi";

export interface DAOBI_CONTRACT {
  name: string;
  address: string;
  ABI: JsonFragment[];
  visibleMethods: string[];
}

export const DAOBI_CONTRACTS: DAOBI_CONTRACT[] = [
  {
    name: "Voting",
    address:
      process.env.NEXT_PUBLIC_VOTE_ADDR ??
      "0xdB22a7D54504Cba851d2dbdC1b354B8C1B3E64D5",
    ABI: VoteContract,
    visibleMethods: [
      "register",
      "vote",
      "seeBallot",
      "checkStatus",
      "assessVotes",
      "getAlias",
      "recluse",
      "selfImmolate",
    ],
  },
  {
    name: "Chancellor's Seal",
    address:
      process.env.NEXT_PUBLIC_SEAL_ADDR ??
      "0x6F5ec4A3Ff18647105cd42754846c86E3cDEec93",
    ABI: ChancellorsSeal,
    visibleMethods: [
      "totalSupply",
      "symbol",
      "tokenURI",
      "DAOBI_CONTRACT",
      "DEFAULT_ADMIN_ROLE",
      "PAUSER_ROLE",
      "SEAL_MANAGER",
      "UPGRADER_ROLE",
      // 'renounceRole'?
    ],
  },
  {
    name: "Token",
    address:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x68af95a6f932a372e88170e9c2a46094FAeFd5D4",
    ABI: Contract3,
    visibleMethods: [
      "chancellorSalary",
      "claimChancellorSalary",
      "makeClaim",
      "salaryInterval",
      "mint",
      "lastSalaryClaim",
      "recoverSeal",
      "chancellor",
    ],
  },
];

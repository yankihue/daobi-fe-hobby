import Contract3 from "./DAObiContract3.json";
import ChancellorsSeal from "./DaobiChancellorsSeal.json";
import VoteContract from "./DaobiVoteContract.json";

import { JsonFragment } from "@ethersproject/abi";
import { env } from "process";

export interface DAOBI_CONTRACT {
  name: string;
  address: string;
  ABI: JsonFragment[];
  visibleMethods: string[];
}

export const DAOBI_CONTRACTS: DAOBI_CONTRACT[] = [
  {
    name: "Contract3",
    address:
      process.env.NEXT_PUBLIC_TOKEN_ADDR ??
      "0x68af95a6f932a372e88170e9c2a46094FAeFd5D4",
    ABI: Contract3,
    visibleMethods: [
      "chancellorSalary",
      "claimChancellorSalary",
      "salaryInterval",
      "lastSalaryClaim",
      "makeClaim",
      "recoverSeal",
      "chancellor",
      "mint",
    ],
  },
  {
    name: "ChancellorsSeal",
    address:
      process.env.NEXT_PUBLIC_SEAL_ADDR ??
      "0x6F5ec4A3Ff18647105cd42754846c86E3cDEec93",
    ABI: ChancellorsSeal,
    visibleMethods: [
      "symbol",
      "totalSupply",
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
    name: "VoteContract",
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
];

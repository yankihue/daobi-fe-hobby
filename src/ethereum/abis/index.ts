import Contract3 from "./DAObiContract3.json";
import ChancellorsSeal from "./DaobiChancellorsSeal.json";
import VoteContract from "./DaobiVoteContract.json";

import { JsonFragment } from "@ethersproject/abi";

type UserFriendlyMethod = Record<string, string>;
interface UserFriendlySection {
  title: string;
  methods: Record<string, UserFriendlyMethod>;
}
export interface DAOBI_CONTRACT {
  name: string;
  address: string;
  ABI: JsonFragment[];
  heading: string;
  userFriendlySections?: Record<string, UserFriendlySection>;
}

export const VOTING_CONTRACT: DAOBI_CONTRACT = {
  name: "Voting",
  address:
    process.env.NEXT_PUBLIC_VOTE_ADDR ??
    "0xdB22a7D54504Cba851d2dbdC1b354B8C1B3E64D5",
  ABI: VoteContract,
  heading: "The Inner Courtyard",
  userFriendlySections: {
    registration: {
      title: "Enter the Imperial Court",
      methods: {
        register: {
          _initialVote:
            "Please enter the address of the courtier whose faction you will be joining",
          _name: "Courtesy Name",
        },
      },
    },
    changeVote: {
      title: "Join a faction",
      methods: {
        vote: {
          _voteFor:
            "Please enter the address of the courtier whose faction you will be joining",
        },
      },
    },
    investigateRivals: {
      title: "Investigate Your Rivals",
      methods: {
        seeBallot: {
          _voter:
            "To find out which faction another courtier belongs to, enter their address here",
        },
        checkStatus: {
          _voter:
            "To find out whether a potential rival is currently present in the Imperial Court, enter their address here",
        },
        assessVotes: {
          _voter:
            "To learn how many acolytes a rival courtier has, enter their address here",
        },
        getAlias: {
          _voter:
            "To find out which courtier owns a particular address, enter it here",
        },
      },
    },
    abandon: {
      title:
        "Abandon your faction and withdraw into reclusion on your country estates.",
      methods: {
        recluse: {},
      },
    },
    selfImmolation: {
      title:
        "Self-immolation: the last recourse when all other forms of protest have failed. Click here to ceremonially burn your voting token",
      methods: {
        selfImmolate: {},
      },
    },
  },
};

export const NFT_CONTRACT: DAOBI_CONTRACT = {
  name: "NFT",
  address:
    process.env.NEXT_PUBLIC_SEAL_ADDR ??
    "0x6F5ec4A3Ff18647105cd42754846c86E3cDEec93",
  ABI: ChancellorsSeal,
  heading: "The Imperial Secretariat",
};

export const TOKEN_CONTRACT: DAOBI_CONTRACT = {
  name: "Token",
  address:
    process.env.NEXT_PUBLIC_TOKEN_ADDR ??
    "0x68af95a6f932a372e88170e9c2a46094FAeFd5D4",
  ABI: Contract3,
  heading: "The Chancellery",
  userFriendlySections: {
    makeClaim: {
      title: "Claim your daily stipend here",
      methods: {
        makeClaim: {},
      },
    },
    chancellorSalary: {
      title: `Chancellor’s emoluments`,
      methods: {
        chancellorSalary: {},
      },
    },
    salaryInterval: {
      title: "Time between stipend payments",
      methods: {
        salaryInterval: {},
      },
    },
    lastSalaryClaim: {
      title: "Time since last stipend payment was claimed",
      methods: {
        lastSalaryClaim: {},
      },
    },
    claimChancellorSalary: {
      title: "",
      methods: {
        claimChancellorSalary: {},
      },
    },
    mint: {
      title: "",
      methods: {
        mint: {},
      },
    },
    recoverSeal: {
      title: "",
      methods: {
        recoverSeal: {},
      },
    },
    chancellor: {
      title: "",
      methods: {
        chancellor: {},
      },
    },
  },
};

export const DAOBI_CONTRACTS: DAOBI_CONTRACT[] = [
  VOTING_CONTRACT,
  NFT_CONTRACT,
  TOKEN_CONTRACT,
];

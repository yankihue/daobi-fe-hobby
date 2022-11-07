import { DAObiContract3 } from "./DAObiContract3";
import { DAObiChancellorsSeal } from "./DAObiChancellorsSeal";
import { DAObiVoteContract } from "./DAObiVoteContract";
import { JsonFragment } from "@ethersproject/abi";

export type UserFriendlyMethod = Record<string, string>;
export interface UserFriendlySection {
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
    "0xbb1AE89B97134a753D1852A83d7eE15Ed1C46DE0",
  ABI: DAObiVoteContract,
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
      title: "Join a different faction",
      methods: {
        vote: {
          _voteFor:
            "Please enter the address of the courtier whose faction you will be switching to",
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
            "To find out whether a potential rival is currently present in the Imperial Court, \nenter their address here",
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
        "Self-immolation; the last recourse when all other forms of protest have failed. Click here to ceremonially burn your voting token.",
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
  ABI: DAObiChancellorsSeal,
  heading: "The Imperial Secretariat",
};

export const TOKEN_CONTRACT: DAOBI_CONTRACT = {
  name: "Token",
  address:
    process.env.NEXT_PUBLIC_TOKEN_ADDR ??
    "0x82A9313b7D869373E80776e770a9285c2981C018",
  ABI: DAObiContract3,
  heading: "The Chancellery",
  userFriendlySections: {
    claimChancellorSalary: {
      title: "Claim the daily Chancellor's Salary here.",
      methods: {
        claimChancellorSalary: {},
      },
    },
    mint: {
      title: "Introduce additional currency into circulation.",
      methods: {
        mint: {
          amount:
            "Number of coins to mint \n(these will automatically be transferred to Uniswap on your behalf)",
        },
      },
    },
    makeClaim: {
      title: `You've gained enough favor in the court. \nTime has come to claim your rightful title as Chancellor.`,
      methods: {
        makeClaim: {},
      },
    },
    chancellorSalary: {
      title: `Chancellor’s emoluments:`,
      methods: {
        chancellorSalary: {},
      },
    },
    salaryInterval: {
      title: "Time between stipend payments:",
      methods: {
        salaryInterval: {},
      },
    },
    lastSalaryClaim: {
      title: "Time since last stipend payment was claimed:",
      methods: {
        lastSalaryClaim: {},
      },
    },
    // recoverSeal: {
    //   title: "",
    //   methods: {
    //     recoverSeal: {},
    //   },
    // },
  },
};

export const DYNAMIC_DAOBI_CONTRACTS: DAOBI_CONTRACT[] = [
  TOKEN_CONTRACT,
  VOTING_CONTRACT,
];

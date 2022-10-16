import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { getToken } from "next-auth/jwt";
import { getCsrfToken } from "next-auth/react";
import VoteABI from "../../../ethereum/abis/DaobiVoteContract.json";

/** Twitter Verification and Minting Workflow // Draft
 * ** Client-Side **                    ** Server-Side **
 * - new user connects wallet
 * - prompt user to connect Twitter
 * - user approves our app
 * -->                                  - api/auth gets twitter details
 *                                        - implement requirements/checks here,
 *                                          ex: follower count, account age,
 *                                          account used already for dif addr.
 *                                          Latter would req hosting a DB.
 *                                      - a new 'session' is created, JWT is
 *                                      - encoded & sent to client
 * - client is signed in to twitter   <--
 * - have user sign message of:
 *   {
 *      address,
 *      session JWT
 *   }
 * - verify signedMessage was signed
 *   by correct address
 * - call api/verify/[address]
 * -->                                  - verify JWT
 *                                      - mint Token to address
 * - sign out
 *  */

// eslint-disable-next-line import/no-anonymous-default-export
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message?: string; error?: Error | string }>
) {
  const {
    query: { address },
    body: signature,
    method,
  } = req;

  // JWT CONTAINS IDENTIFY INFO
  // DO NOT LOG
  const jwt = await getToken({ req });
  const csrfToken = await getCsrfToken({ req });

  const uniqueMessage =
    `Signing this message verifies that you have completed linking your Twitter. \nAfter you sign this message, DAObi will approve your wallet address on the Voting contract, and your Twitter will be disconnected. \nNeither your address or Twitter will be saved by DAObi, but we still recommend clearing your cookies after verification is completed. \n` +
    JSON.stringify({
      address: address,
      authToken: csrfToken,
    });

  // server-side verification of message
  const resolvedAddress = ethers.utils.verifyMessage(uniqueMessage, signature);

  switch (method) {
    case "PUT":
      // check auth tokens (CSRF/JWT) exists & user isn't trying to forge signatures
      if (!csrfToken || !jwt || resolvedAddress !== address) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (csrfToken && jwt) {
        // Signed in
        // try to mint NFT to user's address
        try {
          const voteContractWrite = await initiateVoteContractWithSigner();
          const tx: ethers.ContractTransaction = await voteContractWrite.mint(
            address
          );

          const receipt = tx.wait(2);

          if (receipt) {
            return res.status(200).json({
              message: "Verification Successful",
            });
          }
        } catch (error) {
          // if minting fails, tell user reason, and log to server
          return res.status(500).json({
            message: "Internal Server Error while trying to mint.",
            error: error,
          });
        }
      }

      break;
    default:
      return res.status(400).json({
        message: " This API Route only accepts 'PUT' requests.",
        error: "Bad Request",
      });
  }
}

const initiateVoteContractWithSigner = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com"
  );
  await provider.ready;
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider);
  const voteContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_VOTE_ADDR,
    VoteABI,
    signer
  );
  return voteContract;
};

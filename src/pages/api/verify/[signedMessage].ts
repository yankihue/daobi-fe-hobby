import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

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
  res: NextApiResponse<{ success: boolean; reason: string }>
) {
  const {
    query: { address },
    method,
  } = req;

  switch (method) {
    case "PUT":

    // check JWT

    // if unauth, return 401 unauthorized

    // if verified, try to mint NFT to user's address

    // TODO use private key to mint()

    // return res.status(200).json({
    //   success: true,
    //   reason: "Successfully Verified. Check your wallet for NFT.",
    // });

    // if minting fails, tell user reason, and log to server

    // return res.status(500).json({
    //   success: false,
    //   reason: `Internal Server Error while trying to mint.\n${JSON.stringify(
    //     error
    //   )}`,
    // });

    default:
      return res.status(400).json({
        success: false,
        reason: "This API Route only accepts 'PUT' requests.",
      });
  }
}

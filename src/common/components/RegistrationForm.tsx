import { Session } from "next-auth";
import { useRouter } from "next/router";
import TwitterAuth from "./TwitterAuth";
import { VOTING_CONTRACT } from "@/ethereum/abis";
import Section from "./Contract/Section";

interface Props {
  address: string;
  isVerified: boolean;
  isRegistered: boolean;
  balanceDB: number;
  twitterSession: Session;
  authToken: string;
  signIn: () => void;
  signOut: () => void;
}

export const RegistrationForm = ({
  address,
  isVerified,
  isRegistered,
  balanceDB,
  twitterSession,
  authToken,
  signIn,
  signOut,
}: Props) => {
  const router = useRouter();

  const reloadRouter = () => {
    router.reload();
  };

  return (
    <div className="flex flex-col justify-center items-center my-auto space-y-6 w-full h-full text-center">
      <h3>Hello {`${address}.`}</h3>
      {!isVerified && !isRegistered && (
        <>
          <p className="max-w-prose break-normal w-fit">
            It looks like you have not yet completed registration.
            <br />
            To protect against bots, we require linking a Twitter account. Your
            address and username are not stored, and your Twitter will be
            disconnected afterwards.
          </p>
          {twitterSession && authToken ? (
            <TwitterAuth signOut={signOut} authToken={authToken} />
          ) : (
            <>
              <p>Click the button below to verify your Twitter.</p>
              <button
                className="p-2 text-black bg-green-200 rounded-lg dark:bg-green-800 dark:text-gray-100"
                onClick={() => signIn()}
              >
                Connect Twitter
              </button>
            </>
          )}
        </>
      )}
      {!isRegistered && isVerified && (
        <>
          {balanceDB === 0 ? (
            <p className="max-w-prose break-normal w-fit">
              You currently hold 0 $DB. Acquire some to prove your worth to a
              faction.
            </p>
          ) : (
            <>
              <p className="max-w-prose break-normal w-fit">
                Twitter verification completed. Time to register your username
                and cast your first vote!
              </p>
              <Section
                {...VOTING_CONTRACT.userFriendlySections.registration}
                contractABI={VOTING_CONTRACT.ABI}
                contractAddress={VOTING_CONTRACT.address}
                reloadRouter={reloadRouter}
              />
            </>
          )}
        </>
      )}

      {isVerified && isRegistered && (
        <p className="max-w-prose break-normal w-fit">
          Congrats! You have already finished connecting your Twitter and
          registering to vote!
        </p>
      )}
    </div>
  );
};

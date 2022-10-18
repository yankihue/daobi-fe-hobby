import { Session } from "next-auth";
import { Dispatch, SetStateAction } from "react";
import TwitterAuth from "../TwitterAuth";

interface Props {
  address: string;
  setShowWalletModal: Dispatch<SetStateAction<boolean>>;
  isVerified: boolean;
  isRegistered: boolean;
  twitterSession: Session;
  authToken: string;
  signIn: () => void;
  signOut: () => void;
}

export const WalletModal = ({
  address,
  setShowWalletModal,
  isVerified,
  isRegistered,
  twitterSession,
  authToken,
  signIn,
  signOut,
}: Props) => {
  return (
    <div
      className="flex absolute top-0 right-0 bottom-0 left-0 z-50 w-full h-screen modal bg-stone-200 dark:bg-stone-900"
      onClick={() => setShowWalletModal(false)}
    >
      <div className="flex fixed top-0 right-0 bottom-0 left-0 flex-col justify-center items-center space-y-2 w-1/2 h-1/2 text-center max-h-xl card">
        <p>Hello {`${address}.`}</p>
        {isVerified && isRegistered && (
          <p>
            Congrats! You have already finished connecting your Twitter and
            registering to vote!
          </p>
        )}

        {!isVerified && !isRegistered && (
          <>
            {twitterSession && authToken ? (
              <TwitterAuth signOut={signOut} authToken={authToken} />
            ) : (
              <button
                className="p-2 border border-ready"
                onClick={() => signIn()}
              >
                Verify Twitter ❎
              </button>
            )}
          </>
        )}
        {!isRegistered &&
          isVerified &&
          `Twitter verification completed. To register as a voter, go to VoteContract > Register.`}
      </div>
    </div>
  );
};

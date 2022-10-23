import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { BytesLike, verifyMessage } from "ethers/lib/utils";

interface Props {
  signOut: () => void;
  authToken: string;
}

const TwitterAuth = ({ signOut, authToken }: Props) => {
  const { address, isConnected } = useAccount();
  const uniqueMessage =
    `Signing this message verifies that you have completed linking your Twitter. \nAfter you sign this message, DAObi will approve your wallet address on the Voting contract, and your Twitter will be disconnected. \nNeither your address or Twitter will be saved by DAObi, but we still recommend clearing your cookies after verification is completed. \n` +
    JSON.stringify({
      address: address,
      authToken,
    });

  const {
    data: signedMessage,
    isLoading,
    isSuccess: successfullySigned,
    signMessage,
  } = useSignMessage({
    message: uniqueMessage,
  });

  const [verificationStatus, setVerificationStatus] = useState<any>({
    loading: true,
    message: null,
    error: null,
  });

  const verifySignedMessage = (signature: BytesLike): boolean => {
    const resolvedAddress = verifyMessage(uniqueMessage, signature);
    return resolvedAddress === address;
  };

  const submitVerification = async () => {
    const res = await fetch(`/api/verify/${address}`, {
      method: "PUT",
      body: JSON.stringify(signedMessage),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (json?.message === "Verification Successful") {
      console.log("Successfully Verified");
      signOut();
    } else {
      console.log(`Error verifying...\n`, { ...json });
      setVerificationStatus({
        loading: false,
        message: json?.message,
        error: json?.error?.reason ?? json?.error,
      });
    }
  };

  useEffect(() => {
    // on load
    if (!signedMessage && !isLoading && isConnected) {
      // prompt user to sign
      signMessage();
    } else if (
      // user signed message
      successfullySigned &&
      signedMessage
    ) {
      // client-side verifying of message
      const authorized = verifySignedMessage(signedMessage);
      if (authorized) {
        // make call to api/verify/[address]
        submitVerification();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedMessage, successfullySigned, address, isConnected]);

  return (
    <>
      {!verificationStatus?.error && (
        <button
          className="p-2 text-black bg-green-200 rounded-lg animate-pulse dark:bg-green-800 dark:text-gray-100"
          onClick={() => signMessage()}
        >
          Sign Message To Complete Verification...
        </button>
      )}

      {verificationStatus?.error && (
        <p>
          {verificationStatus?.message ?? verificationStatus?.error}
          <br />
          Try again. If issue persists, check in Discord.
        </p>
      )}
    </>
  );
};

export default TwitterAuth;

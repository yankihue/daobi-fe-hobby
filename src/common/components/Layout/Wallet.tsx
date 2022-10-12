/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import useRoles from "@/hooks/useRoles";
import { toTrimmedAddress } from "@/utils/index";
import { signIn, useSession, signOut, getCsrfToken } from "next-auth/react";
import TwitterAuth from "../TwitterAuth";

const Wallet = (): JSX.Element => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const [showDialog, setShowDialog] = useState(false);

  const { isVerified, isChancellor, rolesLoading, rolesErrors } =
    useRoles(address);

  // next-auth twitter
  const { data: twitterSession, status: twitterStatus } = useSession();
  const [authToken, setAuthToken] = useState<null | string>();

  // close dialog/modal with escape
  const handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      setShowDialog(false);
    }
  };

  useEffect(() => {
    const getAuthToken = async () => {
      const csrfToken = await getCsrfToken();
      if (csrfToken) setAuthToken(csrfToken);
    };

    if (twitterStatus === "authenticated") {
      getAuthToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twitterStatus]);

  return (
    <>
      {isConnected ? (
        <div>
          <div>{toTrimmedAddress(address)}</div>
          <div>
            {!isVerified && !rolesLoading && (
              <>
                {twitterSession && authToken ? (
                  <TwitterAuth signOut={signOut} authToken={authToken} />
                ) : (
                  <button
                    className="px-1 border border-green-100 animate-pulse"
                    onClick={() => signIn()}
                  >
                    Verify Twitter ❎
                  </button>
                )}
              </>
            )}
            {isVerified &&
              !rolesLoading &&
              `${
                isChancellor ? "👑 Welcome Chancellor! 🏰" : "🌾 One Day... 🛖"
              }
          `}
          </div>
          <button onClick={() => disconnect?.()}>Disconnect</button>
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowDialog(true)}
            onKeyDown={(e) => handleKeyDown(e)}
          >
            Connect Wallet
          </button>
          {error && <div>{error?.message ?? "Failed to connect"}</div>}
        </>
      )}
      {showDialog && !address && (
        <div
          className="absolute top-0 right-0 bottom-0 left-0 z-50 w-screen h-screen bg-transparent"
          onClick={() => setShowDialog(false)}
        >
          <dialog
            className="grid relative grid-cols-2 grid-rows-2 gap-2 p-6 mt-16 mr-12 ml-auto w-80 h-44 bg-white border shadow-lg"
            open={showDialog}
          >
            {connectors.map((connector) => {
              return (
                <button
                  className="p-2 text-xs border"
                  // disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => {
                    setShowDialog(false);
                    connect({ connector });
                  }}
                >
                  {connector.name}
                  {!connector.ready && " (unsupported)"}
                  {isLoading &&
                    connector.id === pendingConnector?.id &&
                    " (connecting)"}
                </button>
              );
            })}
          </dialog>
        </div>
      )}
    </>
  );
};

export default Wallet;

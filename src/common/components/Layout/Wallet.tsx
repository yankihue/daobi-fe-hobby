/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import useRoles from "@/hooks/useRoles";
import { toTrimmedAddress } from "@/utils/index";
import { signIn, useSession, signOut, getCsrfToken } from "next-auth/react";
import { WalletModal } from "./WalletModal";

const Wallet = (): JSX.Element => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [showWalletModal, setShowWalletModal] = useState(false);

  // next-auth twitter
  const [showDialog, setShowDialog] = useState(false);
  const { isVerified, isRegistered } = useRoles(address);
  const { data: twitterSession, status: twitterStatus } = useSession();
  const [authToken, setAuthToken] = useState<null | string>();

  // dark mode
  const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (darkMode) {
      window.document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      window.document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [darkMode]);

  // close dialog/modal with escape
  const handleKeyDown = (e) => {
    if (e.keyCode === 27) {
      setShowDialog(false);
      setShowWalletModal(false);
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
        <div className="flex gap-4 justify-end items-center w-full">
          <button className="" onClick={() => toggleDarkMode()}>
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 cursor-pointer"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 cursor-pointer"
            onClick={() => setShowWalletModal(true)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <button onClick={() => disconnect?.()}>Disconnect</button>
          {showWalletModal && (
            <WalletModal
              address={toTrimmedAddress(address)}
              setShowWalletModal={setShowWalletModal}
              isVerified={isVerified}
              isRegistered={isRegistered}
              authToken={authToken}
              twitterSession={twitterSession}
              signIn={signIn}
              signOut={signOut}
            />
          )}
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
          className="absolute top-0 right-0 bottom-0 left-0 z-50 w-full max-w-full h-screen bg-transparent"
          onClick={() => setShowDialog(false)}
        >
          <dialog
            className="grid relative grid-cols-2 grid-rows-2 gap-2 p-4 mt-14 mr-10 ml-auto w-80 h-44 rounded-lg border-2 border-color-mode"
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

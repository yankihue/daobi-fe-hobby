import type { NextPage } from "next";
import { useAccount } from "wagmi";
import useRoles from "@/hooks/useRoles";
import { useEffect, useState } from "react";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import RegistrationForm from "@/components/RegistrationForm";
import { toTrimmedAddress } from "../utils";
import ContractSelection from "@/components/ContractSelection";
import MakeClaimModal from "@/components/MakeClaimModal";

const Home: NextPage = () => {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const { address } = useAccount();
  const {
    isVerified,
    isRegistered,
    balanceDB,
    canClaimChancellor,
    rolesLoading,
  } = useRoles(address);

  // next-auth twitter
  const { data: twitterSession, status: twitterStatus } = useSession();
  const [authToken, setAuthToken] = useState<null | string>();

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

  useEffect(() => {
    if (showClaimModal !== canClaimChancellor && !rolesLoading) {
      setShowClaimModal(canClaimChancellor);
    }
  }, [canClaimChancellor, rolesLoading, showClaimModal]);

  return (
    <div className="flex flex-col w-full h-full grow">
      {!address && (
        <p className="my-auto font-bold text-center break-words">
          Please Connect Your Wallet
        </p>
      )}
      {address && rolesLoading && (
        <p className="font-bold text-center break-words">
          Greetings! Loading your roles...
        </p>
      )}
      {!isRegistered && !rolesLoading && address && (
        <RegistrationForm
          address={toTrimmedAddress(address)}
          isVerified={isVerified}
          isRegistered={isRegistered}
          balanceDB={balanceDB}
          authToken={authToken}
          twitterSession={twitterSession}
          signIn={signIn}
          signOut={signOut}
        />
      )}
      {showClaimModal && (
        <MakeClaimModal setShowClaimModal={setShowClaimModal} />
      )}
      {isRegistered && <ContractSelection />}
    </div>
  );
};

export default Home;

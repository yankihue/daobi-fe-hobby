import type { NextPage } from "next";
import { useAccount } from "wagmi";
import useRoles from "@/hooks/useRoles";
const Home: NextPage = () => {
  const { address } = useAccount();
  const { isVerified, isRegistered } = useRoles(address);
  return (
    <div className="flex flex-col place-self-start w-full h-full">
      {!address &&
        {
          /* connect wallet */
        }}
      {!isVerified &&
        {
          /* verify twitter so we can mint token */
        }}
      {!isRegistered &&
        {
          /* cast initial vote */
        }}
      {isRegistered &&
        {
          /* full access contract selection */
        }}
    </div>
  );
};

export default Home;

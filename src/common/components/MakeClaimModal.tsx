import { Dispatch, SetStateAction } from "react";
import { TOKEN_CONTRACT } from "@/ethereum/abis";
import Section from "./Contract/Section";

interface Props {
  setShowClaimModal: Dispatch<SetStateAction<boolean>>;
}

const MakeClaimModal = ({ setShowClaimModal }: Props) => {
  const hideModal = () => setShowClaimModal(false);
  return (
    <>
      <div className="flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full max-w-full h-full min-h-full bg-white bg-opacity-95 dark:bg-opacity-90 dark:bg-black">
        <div className="fixed m-auto w-2/3 h-1/2 bg-transparent">
          <div className="w-full h-min">
            <Section
              {...TOKEN_CONTRACT.userFriendlySections.makeClaim}
              contractABI={TOKEN_CONTRACT.ABI}
              contractAddress={TOKEN_CONTRACT.address}
              stateHandler={hideModal}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MakeClaimModal;

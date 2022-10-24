import Input from "./Input";
import { JsonFragment, JsonFragmentType } from "@ethersproject/abi";
import { isHexString, hexlify } from "@ethersproject/bytes";
import {
  formatBytes32String,
  parseBytes32String,
  toUtf8Bytes,
} from "@ethersproject/strings";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { useEffect, useState } from "react";
import { BigNumber, BigNumberish, BytesLike, ethers } from "ethers";
import { formatIODefaultValues } from "@/utils/index";

export interface UserCallableFunction {
  functionName: string;
  stateMutability: string;
  inputs: Array<{
    json: JsonFragmentType;
    userFriendlyCopy: string;
  }>;
  outputs: readonly JsonFragmentType[];
  contractABI: JsonFragment[];
  contractAddress: string;
}

const formatInputData = (input: {
  name?: string;
  indexed?: boolean;
  type?: string;
  internalType?: any;
  components?: readonly JsonFragmentType[];
  value: any;
}) => {
  if (typeof input.value === "number") {
    input.value = BigNumber.from(input.value.toString());
  } else if (input.name === "_name") {
    // username
    try {
      return formatBytes32String(input.value);
    } catch (error) {
      // purposefully invalidate the tx with incorrect length bytes
      return hexlify(toUtf8Bytes("FAIL"));
    }
  } else {
    return input.value;
  }
};

const Function = ({
  functionName,
  stateMutability,
  inputs,
  outputs,
  contractABI,
  contractAddress,
}: UserCallableFunction) => {
  const { address } = useAccount();

  // useState for all input values
  const [formData, setFormData] = useState(
    // .sol types -> .js types
    formatIODefaultValues(
      inputs.map((input) => input.json),
      address
    )
  );

  const [msgValue, setMsgValue] = useState(0); // for payable functions
  const [txWillError, setTxWillError] = useState(true); // block transactions until ethers can estimate gas

  // FOR READ FUNCTIONS
  const {
    data: viewData,
    isSuccess: viewIsSuccess,
    isLoading: viewIsLoading,
    refetch: viewRefetch,
  } = useContractRead({
    address: contractAddress,
    abi: [...contractABI] as const,
    functionName: functionName,
    args:
      inputs?.length > 0
        ? formData?.map((input) => {
            return formatInputData(input);
          })
        : undefined,
  });

  // FOR WRITE FUNCTIONS
  const { config, refetch } = usePrepareContractWrite({
    address: contractAddress,
    abi: [...contractABI] as const,
    functionName: functionName,
    args: formData?.map((input) => {
      return formatInputData(input);
    }),
    overrides: {
      value: ethers.utils.parseEther(msgValue.toString()),
    },
    onSuccess() {
      setTxWillError(false);
    },
    onError(error: any) {
      setTxWillError(true);
    },
  });

  // TODO: implement notification of Tx status
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const formattedViewData =
    typeof viewData !== "object"
      ? isHexString(viewData, 32)
        ? parseBytes32String(viewData as BytesLike)
        : viewData?.toString() ?? viewData
      : (viewData as BigNumberish)?.toString();

  // re-estimate when values change
  useEffect(() => {
    function refreshEstimates() {
      if (stateMutability === "view") {
        refetch();
      } else {
        viewRefetch();
      }
    }
    refreshEstimates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <>
      {inputs?.length > 0 && (
        <>
          <form className="px-6 space-y-4 w-full">
            {inputs?.map((input, idx) => (
              <Input
                key={`${input.json.name}-${contractAddress}-${idx}`}
                input={input}
                value={formData[idx].value}
                idx={idx}
                formData={formData}
                setFormData={setFormData}
                isMsgValue={false}
              />
            ))}

            {/* field for payable function */}
            {stateMutability === "payable" && (
              <Input
                key={`${msgValue}-${contractAddress}-${name}`}
                input={{
                  json: { name: "msgValue", type: "uint256" },
                  userFriendlyCopy: "MATIC",
                }}
                value={msgValue}
                idx={0}
                formData={msgValue}
                setFormData={setMsgValue}
                isMsgValue={true}
              />
            )}
          </form>
        </>
      )}
      <div className="flex flex-row justify-center items-center px-6 py-2 w-full">
        {stateMutability !== "view" ? (
          <button
            className={`py-2 px-4 mb-2 min-w-20 max-w-20 border h-min ${
              txWillError ? "border-error" : "border-ready"
            }`}
            onClick={async (e) => {
              e.preventDefault();
              write?.();
            }}
            disabled={txWillError}
          >
            {functionName.includes("claim") || functionName.includes("Claim")
              ? "Claim"
              : "Submit"}
          </button>
        ) : (
          <div className="mx-auto w-full text-center">
            {viewIsLoading && <p>Loading...</p>}
            {viewIsSuccess && (
              <>
                <div className="overflow-x-auto mb-6 max-w-32 scrollbar">
                  {formattedViewData}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Function;

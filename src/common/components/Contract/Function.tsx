import Input from "./Input";
import { JsonFragment, JsonFragmentType } from "@ethersproject/abi";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { useEffect, useState } from "react";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { formatIODefaultValues } from "@/utils/index";
import { BytesLike } from "ethers/lib/utils";

interface Props {
  name: string;
  stateMutability: string;
  inputs: readonly JsonFragmentType[];
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
  } else if (input.type === "bytes6") {
    // username
    let utf8 = ethers.utils.toUtf8Bytes(input.value);
    let hexstring = ethers.utils.hexlify(utf8);
    if (input.value.length < 6) {
      hexstring = ethers.utils.hexZeroPad(hexstring, 6);
    }
    return hexstring;
  } else {
    return input.value;
  }
};

const Function = ({
  name,
  stateMutability,
  inputs,
  outputs,
  contractABI,
  contractAddress,
}: Props) => {
  const { address } = useAccount();

  // useState for all input values
  const [formData, setFormData] = useState(
    formatIODefaultValues(inputs, address) // .sol types -> .js types
  );
  const [msgValue, setMsgValue] = useState(0); // for payable functions
  const [txWillError, setTxWillError] = useState(true); // block transactions until ethers can estimate gas
  const [errorMsg, setErrorMsg] = useState<null | string | Error>(
    "Tx will likely fail... Make sure you have proper permissions, enough money for gas, etc."
  );

  // FOR READ FUNCTIONS
  const {
    data: viewData,
    isSuccess: viewIsSuccess,
    isError: viewIsError,
    isLoading: viewIsLoading,
    refetch: viewRefetch,
  } = useContractRead({
    address: contractAddress,
    abi: [...contractABI] as const,
    functionName: name,
    args:
      inputs?.length > 0
        ? formData?.map((input) => {
            return formatInputData(input);
          })
        : undefined,
    onError(error: any) {
      setErrorMsg(
        JSON.stringify(
          (error?.reason ?? "") +
            " - " +
            (error?.error?.message ?? "") +
            " - " +
            (error?.code ?? "") +
            " - " +
            (error?.argument ?? "")
        )
      );
    },
  });

  // FOR WRITE FUNCTIONS
  const { config, refetch } = usePrepareContractWrite({
    address: contractAddress,
    abi: [...contractABI] as const,
    functionName: name,
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
      setErrorMsg(
        JSON.stringify(
          (error?.reason ?? "") +
            " - " +
            (error?.error?.message ?? "") +
            " - " +
            (error?.code ?? "") +
            " - " +
            (error?.argument ?? "")
        )
      );
    },
  });

  // TODO: implement notification of Tx status
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const formattedViewData =
    typeof viewData !== "object"
      ? ethers.utils.isHexString(viewData, 6)
        ? ethers.utils.toUtf8String(viewData as BytesLike)
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
    <div className="flex flex-col justify-between card">
      <div className="px-6 py-4 w-full border-b border-color-mode">
        <h3 className="mx-auto text-lg font-bold text-center">{`${name}:`}</h3>
      </div>
      {inputs?.length > 0 && (
        <>
          <br />
          <form className="px-6 w-full">
            {inputs?.map((input, idx) => (
              <Input
                key={`${input.name}-${contractAddress}-${idx}`}
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
                input={{ name: "msgValue", type: "uint256" }}
                value={msgValue}
                idx={0}
                formData={msgValue}
                setFormData={setMsgValue}
                isMsgValue={true}
              />
            )}
            <br />
          </form>
        </>
      )}
      <div className="flex flex-row justify-around items-center px-6 py-2 w-full border-t border-color-mode">
        {txWillError && stateMutability !== "view" && (
          <p className="overflow-auto p-2 mr-2 rounded-md border border-color-mode">
            {errorMsg && "ERROR: " + errorMsg}
          </p>
        )}
        {stateMutability !== "view" ? (
          <button
            className={`p-2 min-w-20 max-w-20 mt-auto mr-0 mb-0 ml-auto border h-min ${
              txWillError ? "border-error" : "border-ready"
            }`}
            onClick={async (e) => {
              e.preventDefault();
              write?.();
            }}
            disabled={txWillError}
          >
            Submit
          </button>
        ) : (
          <div className="mx-auto w-full text-center">
            <br />
            {viewIsLoading && <p>Loading...</p>}
            {viewIsError && <p>Error</p>}
            {viewIsSuccess && (
              <>
                <div className="overflow-x-auto max-w-32 scrollbar">
                  {formattedViewData}
                </div>
                <p className="text-sm italic font-light">
                  {`(${outputs[0].type})`}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Function;

import { UserFriendlyMethod } from "@/ethereum/abis";
import { JsonFragment } from "@ethersproject/abi";
import { useEffect, useState } from "react";
import Function, { UserCallableFunction } from "./Function";

interface Props {
  title: string;
  methods: Record<string, UserFriendlyMethod>;
  contractAddress: string;
  contractABI: JsonFragment[];
  reloadRouter?: () => void;
}

const Section = ({
  title,
  methods,
  contractAddress,
  contractABI,
  reloadRouter,
}: Props) => {
  const [toast, setToast] = useState<{
    status: "loading" | "error" | "success";
    hash?: string;
  } | null>(null);

  // get functions from abi
  const allContractFunctions = contractABI.filter(
    (method) => method.type === "function" && method?.name
  );

  const userCallableFunctions: UserCallableFunction[] = [];

  // filter out user callable functions
  Object.entries(methods).forEach(([methodName, methodInputs]) => {
    let userFunc: UserCallableFunction | null = null;

    allContractFunctions.map(
      ({ name: abiName, inputs, outputs, stateMutability, ...func }) => {
        if (abiName === methodName) {
          userFunc = {} as UserCallableFunction;
          userFunc["functionName"] = abiName;
          userFunc["stateMutability"] = stateMutability;
          userFunc["outputs"] = outputs;
          userFunc["contractABI"] = contractABI;
          userFunc["contractAddress"] = contractAddress;
          userFunc["inputs"] = inputs.map((input) => {
            return {
              json: input,
              userFriendlyCopy: methodInputs[`${input.name}`],
            };
          });
        }
      }
    );

    if (userFunc !== null) {
      userCallableFunctions.push(userFunc);
    }
  });

  // hide success / error toast after 15 seconds
  const deleteToast = () => {
    setToast(null);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (toast?.status === "error" || toast?.status === "success") {
        deleteToast();
      }
    }, 15000);
    return () => {
      clearInterval(interval);
    };
  }, [toast]);

  return (
    <>
      {/* tx status toast */}
      {toast && (
        <div className="flex fixed right-0 bottom-0 z-50 justify-end items-end mr-6 mb-4 w-fit h-fit">
          <div className="sticky bottom-0">
            <div
              className={
                "relative px-6 py-4 max-w-prose max-h-16 text-center rounded-lg " +
                `${
                  toast?.status === "loading"
                    ? "animate-bounce bg-yellow-300 dark:bg-yellow-600"
                    : toast?.status === "success"
                    ? "animate-pulse bg-green-200 dark:bg-green-800"
                    : // else isError
                      "animate-pulse bg-red-300 dark:bg-red-600"
                }`
              }
            >
              {/* {isLoading && ( */}
              {toast?.status === "loading" && (
                <p className="italic">Tx Pending...</p>
              )}
              {/* {isSuccess && ( */}
              {toast?.status === "success" && (
                <p className="font-bold">
                  Success!{" "}
                  {toast?.hash && (
                    <a
                      href={`https://mumbai.polygonscan.com/tx/${toast?.hash}`}
                    >
                      View on Explorer.
                    </a>
                  )}
                </p>
              )}
              {/* {isSuccess && ( */}
              {toast?.status === "error" && (
                <p className="font-bold">
                  Tx Failed
                  {toast?.hash && (
                    <>
                      :{" "}
                      <a
                        href={`https://mumbai.polygonscan.com/tx/${toast?.hash}`}
                      >
                        View on Explorer.
                      </a>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-between max-w-3xl card">
        <h3 className="p-4 mb-2 text-xl text-center border-b border-color-mode">
          {title}
        </h3>
        {userCallableFunctions.map((userFunc) => {
          return (
            <Function
              key={userFunc.functionName}
              {...userFunc}
              reloadRouter={reloadRouter}
              setToast={setToast}
            />
          );
        })}
      </div>
    </>
  );
};

export default Section;

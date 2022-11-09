import { DYNAMIC_DAOBI_CONTRACTS } from "@/ethereum/abis";
import Image from "next/image";
import { useState } from "react";
import Contract from "./Contract";

const ContractSelection = () => {
  const [activeTab, setActiveTab] = useState(1); // contract nav

  return (
    <>
      <div className="flex justify-center items-center px-2 pt-2 mx-auto w-full h-16 md:px-4 md:h-auto md:border-b md:flex-row md:w-full md:max-w-7xl border-color-mode">
        {/* Tab Selection */}
        {DYNAMIC_DAOBI_CONTRACTS.map((contract, idx) => {
          return (
            <button
              key={contract.name + "button" + idx}
              onClick={() => setActiveTab(idx)}
              className={`border pb-2 md:border-0 px-4 box-content w-1/3 text-sm md:text-xl h-full ${
                activeTab === idx
                  ? "font-bold text-orange-600 md:!border-b-2 border-orange-600"
                  : "font-medium"
              }`}
            >
              {contract.heading}
            </button>
          );
        })}
        <button
          key="nftbutton"
          onClick={() => setActiveTab(2)}
          className={`border pb-2 md:border-0 px-4 box-content w-1/3 text-sm md:text-xl h-full ${
            activeTab === 2
              ? "font-bold text-orange-600 md:!border-b-2 border-orange-600"
              : "font-medium"
          }`}
        >
          The Imperial Secretariat
        </button>
      </div>
      {/* Function Grid */}
      {DYNAMIC_DAOBI_CONTRACTS.map((contract, idx) => {
        if (contract?.ABI) {
          return (
            <>
              {activeTab === idx && (
                <div
                  key={contract.name + "div" + idx}
                  className={`${activeTab === idx ? "" : "hidden"}`}
                >
                  <Contract key={contract.name + "div" + idx} {...contract} />
                </div>
              )}
            </>
          );
        }
      })}

      {activeTab === 2 && (
        <div
          key="nftdiv"
          className="flex flex-col mx-1 mt-2 space-y-2 min-h-screen md:mx-16 xl:mx-32 2xl:mx-64"
        >
          <h2 className="text-2xl text-center">The Chancellor&apos;s Seal</h2>
          <div className="flex relative flex-1">
            <Image
              layout="fill"
              objectFit="contain"
              src="/Seal.png"
              alt="A clearly scuffed up Chancellor's Seal"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ContractSelection;

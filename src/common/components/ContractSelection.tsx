/* eslint-disable @next/next/no-img-element */
import { DAOBI_CONTRACTS } from "@/ethereum/abis";
import { useState } from "react";
import Contract from "./Contract";

export const ContractSelection = () => {
  const [activeTab, setActiveTab] = useState(1); // contract nav

  return (
    <>
      <div className="flex justify-center items-center px-2 mx-auto w-full h-16 md:px-4 md:h-auto md:border-b md:flex-row md:w-full md:max-w-7xl border-color-mode">
        {/* Tab Selection */}
        {DAOBI_CONTRACTS.map((contract, idx) => {
          return (
            <button
              key={contract.name}
              onClick={() => setActiveTab(idx)}
              className={`border md:border-0 py-2 px-4 box-content w-1/3 text-sm md:text-xl h-full ${
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
          key="nft"
          onClick={() => setActiveTab(2)}
          className={`border md:border-0 py-2 px-4 box-content w-1/3 text-sm md:text-xl h-full ${
            activeTab === 2
              ? "font-bold text-orange-600 md:!border-b-2 border-orange-600"
              : "font-medium"
          }`}
        >
          The Imperial Secretariat
        </button>
      </div>
      {/* Function Grid */}
      {DAOBI_CONTRACTS.map((contract, idx) => {
        if (contract.name === "Voting") {
          delete contract.userFriendlySections.registration;
        }
        return (
          <>
            {activeTab === idx && (
              <div
                key={contract.name}
                className={`${activeTab === idx ? "" : "hidden"}`}
              >
                <Contract {...contract} />
              </div>
            )}
          </>
        );
      })}
      {activeTab === 2 && (
        <div
          key="nft"
          className="flex flex-col mx-1 mt-2 space-y-2 md:mx-16 xl:mx-32 2xl:mx-64"
        >
          <h2 className="text-2xl text-center">The Chancellor&apos;s Seal</h2>
          <img src="/Seal.png" alt="A clearly scuffed up Chancellor's Seal" />
        </div>
      )}
    </>
  );
};

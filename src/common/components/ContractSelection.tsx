import { DAOBI_CONTRACTS } from "@/ethereum/abis";
import { useState } from "react";

export const ContractSelection = () => {
  const [activeTab, setActiveTab] = useState(0); // contract nav

  return (
    <>
      <h2 className="mx-auto w-1/2 text-center">Contracts</h2>
      <div className="flex justify-center items-center mx-auto my-4 w-full h-8 border-b md:w-1/3 border-color-mode">
        {/* Tab Selection */}
        {DAOBI_CONTRACTS.map((contract, idx) => {
          return (
            <button
              key={contract.name}
              onClick={() => setActiveTab(idx)}
              className={`px-4 box-content h-full ${
                activeTab === idx
                  ? "font-bold text-orange-600 border-b-2 border-orange-600"
                  : "font-medium"
              }`}
            >
              {contract.name}
            </button>
          );
        })}
      </div>
      {/* Function Grid */}
      {DAOBI_CONTRACTS.map((contract, idx) => {
        return (
          <div
            key={contract.name}
            className={`${activeTab === idx ? "" : "hidden"}`}
          >
            <Contract {...contract} />
          </div>
        );
      })}
    </>
  );
};

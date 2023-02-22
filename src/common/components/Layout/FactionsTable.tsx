import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
type factionData = {
  [key: string]: string[];
};

function FactionsTable() {
  const [factions, setFactions] = useState<factionData>({});

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=35340816&toBlock=latest&address=0xe8A858B29311652F7e2170118FbEaD34d097e88A&apikey=IXKGJAKDEWBNVMYEHAGSQFI9NZS3TSSJDQ"
      );
      const users = {};
      users["0x0"] = ["0x0", "null", "0x0"];
      for (const event of response.data.result) {
        const topics = event.topics;
        if (
          topics[0] ===
          "0xa629d669aa8e26d0998c7d6a40ad225ddea112e0c54474a08ef6c039bd302476"
        ) {
          const fromAddr = topics[1];
          const name = Buffer.from(event.data.slice(2, 66), "hex")
            .toString("utf-8")
            .replace(/\0/g, "");
          const iniVote = "0x000000000000000000000000" + event.data.slice(-40);
          users[fromAddr] = [fromAddr, name, iniVote];
        } else if (
          topics[0] ===
          "0xce0c7a2a940807f7dc2ce7a615c2532e915e6c0ac9a08bc4ed9d515a710a53e2"
        ) {
          const fromAddr = topics[1];
          users[fromAddr] = [fromAddr, users[fromAddr][1], topics[2]];
        } else if (
          topics[0] ===
          "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
        ) {
          const fromAddr = topics[1];
          if (fromAddr in users) {
            delete users[fromAddr];
          }
        } else if (
          topics[0] ===
          "0xe2795580f31af61313dfda02eec54a3b17d06e395138a74e448cb4cb75d3d818"
        ) {
          const fromAddr = topics[1];
          users[fromAddr] = [fromAddr, users[fromAddr][1], "0x0"];
        }
      }
      const factionsDict = {};
      for (const user of Object.values(users)) {
        console.log("user: " + user);
        const userName = user[1];
        const factionName = user[2] in users ? users[user[2]][1] : "null";
        console.log("userName: " + userName, "factionName: " + factionName);
        if (userName === "null" || factionName === "null") {
          continue;
        }
        if (factionName in factionsDict) {
          factionsDict[factionName]["votes"] += 1;
          factionsDict[factionName]["voters"].push(userName);
        } else {
          factionsDict[factionName] = { votes: 1, voters: [userName] };
        }
      }
      setFactions(factionsDict);
    }
    fetchData();
  }, []);

  return (
    <>
      {" "}
      <div className="flex">
        {" "}
        <h1 className="mx-auto my-6">Registry</h1>
      </div>
      <div className="flex overflow-x-scroll">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mx-auto card">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Leader
              </th>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Supporters
              </th>
            </tr>
          </thead>
          <tbody className="">
            {Object.keys(factions).map((factionName) => (
              <tr
                key={factionName}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 overflow-x-scroll "
              >
                <td className="px-6 py-4">{factionName}</td>
                <td className="px-6 py-4"> {factions[factionName]["votes"]}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {factions[factionName]["voters"].map((voter) => (
                    <span key={voter} className="card p-3 mx-1">
                      {voter}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FactionsTable;

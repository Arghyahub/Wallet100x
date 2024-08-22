"use client";
import React, { useEffect, useState } from "react";
import constants from "@/constants";
import { cn } from "@/lib/utils";

const SERVER = constants.SERVER;
type ConnectionStatus = "1" | "0" | "-1";
const connectionObj = {
  "1": { text: "Connected", styleTW: "text-green-400" },
  "0": { text: "Connecting", styleTW: "text-yellow-400" },
  "-1": { text: "Connection Failed", styleTW: "text-red-400" },
};

const ConnectionCheck = () => {
  const [Connected, setConnected] = useState<ConnectionStatus>("0");

  const coldStart = async () => {
    try {
      const resp = await fetch(SERVER);
      if (resp.ok) setConnected("1");
      else setConnected("-1");
    } catch (error) {
      console.log(error);
      setConnected("-1");
    }
  };

  useEffect(() => {
    coldStart();
  }, []);
  return (
    <div className="relative flex flex-row justify-end items-center">
      <p
        className={cn(
          "px-2 py-1 text-white text-[9px] sm:text-base rounded-md absolute lg:top-5",
          connectionObj[Connected].styleTW
        )}
      >
        Testnet {connectionObj[Connected].text}
      </p>
    </div>
  );
};

export default ConnectionCheck;

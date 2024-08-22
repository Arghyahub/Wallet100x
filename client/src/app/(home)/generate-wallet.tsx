"use client";
import { Button } from "@/components/ui/button";
import useWalletStore from "@/states/wallet";
import React, { useEffect, useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Loader } from "lucide-react";
import MnemonicDisplay from "./mnemonic-display";

type Props = {};

interface FormIp {
  target: {
    mnemonicIp: HTMLTextAreaElement;
  };
}

const GenerateWallet = (props: Props) => {
  const ISSERVER = typeof window === "undefined";
  const [Loading, setLoading] = useState(true);
  const { mnemonic, setMnemonic } = useWalletStore((state) => ({
    mnemonic: state.mnemonic,
    setMnemonic: state.setMnemonic,
  }));

  function handleGenerate() {
    const mnemonic = generateMnemonic();
    setMnemonic(mnemonic);
    localStorage.setItem("mnemonic", mnemonic);
  }

  function handleStore(e: React.FormEvent<HTMLFormElement> & FormIp) {
    e.preventDefault();
    const str = e.target.mnemonicIp.value;
    setMnemonic(str);
    localStorage.setItem("mnemonic", str);
  }

  useEffect(() => {
    if (ISSERVER) return;
    const mnemonic = localStorage.getItem("mnemonic");
    if (mnemonic) {
      setMnemonic(mnemonic);
    }
    setLoading(false);
  }, []);

  if (Loading)
    return (
      <div className="flex flex-row justify-center items-center mt-4 w-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-col gap-2 w-full">
      {mnemonic ? (
        <div className="flex flex-col items-start gap-3 md:mt-5">
          <MnemonicDisplay mnemonic={mnemonic} />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2 mt-5">
            <h1 className="font-medium text-xl">
              Generate a Mnemonic for your crypto wallet
            </h1>
            <Button
              onClick={handleGenerate}
              variant={"secondary"}
              className="ml-auto"
            >
              Generate
            </Button>
          </div>

          <p className="text-center">OR</p>

          <div className="flex flex-col items-center gap-2">
            <h1 className="w-full font-medium text-nowrap text-start text-xl">
              Insert existing Mnemonic
            </h1>
            <form onSubmit={handleStore} className="flex flex-col gap-2 w-full">
              <textarea
                name="mnemonicIp"
                className="bg-slate-200 px-2 py-1 rounded-md w-full text-black"
              />
              <Button variant={"secondary"} type="submit" className="ml-auto">
                Store
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateWallet;

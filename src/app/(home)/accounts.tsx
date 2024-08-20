"use client";
import useWalletStore, { AccountType } from "@/states/wallet";
import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import React, { useEffect } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { ethers } from "ethers";
import Image from "next/image";
import { Copy } from "lucide-react";
import PrivateKeyDialog from "./privatekey-dialog";
import { Button } from "@/components/ui/button";
import GenerateMultipleAcc from "./generate-multipleacc";

type Props = {};

const Accounts = (props: Props) => {
  const ISSERVER = typeof window === "undefined";
  const { mnemonic, setMnemonic, accounts, setAccounts } = useWalletStore(
    (state) => ({
      mnemonic: state.mnemonic,
      setMnemonic: state.setMnemonic,
      accounts: state.accounts,
      setAccounts: state.setAccounts,
    })
  );

  function generateMultipleAccounts(n: number, append = false) {
    if (!mnemonic) return;
    const seed = mnemonicToSeedSync(mnemonic);
    const createAccounts: AccountType[] = [];

    const accountLen = accounts.length;
    for (
      let i = append ? accountLen : 0;
      i < (append ? accountLen + n : n);
      i++
    ) {
      // Solana
      const pathSol = `m/44'/501'/${i}'/0'`; // This is the derivation path
      const derivedSeedSol = derivePath(pathSol, seed.toString("hex")).key;
      //   const secretSol = nacl.sign.keyPair.fromSeed(derivedSeedSol).secretKey;
      //   const publicSol = Keypair.fromSecretKey(secretSol).publicKey.toBase58();
      const publicSol = Keypair.fromSeed(derivedSeedSol).publicKey.toBase58();
      const privateSol = bs58.encode(
        Keypair.fromSeed(derivedSeedSol).secretKey
      );

      //   Ethereum
      const pathEth = `m/44'/60'/0'/0/${i}`;
      const accountEth = ethers.HDNodeWallet.fromSeed(seed).derivePath(pathEth);
      const publicEth = accountEth.publicKey;
      const privateEth = accountEth.privateKey;

      createAccounts.push({
        name: `Account ${i + 1}`,
        tokens: [
          {
            name: "Solana",
            symbol: "SOL",
            publicKey: publicSol,
            privateKey: privateSol,
            balance: 0,
          },
          {
            name: "Ethereum",
            symbol: "ETH",
            publicKey: publicEth,
            privateKey: privateEth,
            balance: 0,
          },
        ],
      });
    }

    if (append) {
      setAccounts([...accounts, ...createAccounts]);
      const len = accounts.length + createAccounts.length;
      localStorage.setItem("numOfAccounts", len.toString());
    } else setAccounts(createAccounts);
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
  }

  function handleRemoveAcc() {
    setMnemonic(null);
    localStorage.removeItem("mnemonic");
    setAccounts([]);
    localStorage.removeItem("numOfAccounts");
  }

  useEffect(() => {
    if (ISSERVER) return;
    const numOfAccounts = localStorage.getItem("numOfAccounts");
    if (numOfAccounts && mnemonic) {
      try {
        generateMultipleAccounts(parseInt(numOfAccounts));
      } catch (error) {
        console.log(error);
      }
    }
  }, [mnemonic]);

  if (!mnemonic) return <></>;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex md:flex-row flex-col justify-between items-center my-2 w-full">
        <h1 className="mb-2 w-full text-start text-xl">Accounts</h1>
        <div className="flex flex-row gap-2">
          <Button
            variant={"default"}
            onClick={() => generateMultipleAccounts(1, true)}
            className="px-2 py-1 text-[10px] sm:text-xs md:text-base"
          >
            Add Account
          </Button>
          {/* <Button variant={"secondary"} onClick={() => {}}>
          Add multiple Account
        </Button> */}
          <GenerateMultipleAcc onClick={(n) => generateMultipleAccounts(n)} />
          <Button
            onClick={handleRemoveAcc}
            variant={"destructive"}
            className="px-2 py-1 text-[10px] sm:text-xs md:text-base"
          >
            Delete Mnemonic
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-full h-full max-h-[48svh] md:max-h-[55svh] overflow-y-auto">
        {accounts.map((account, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border-slate-600 p-2 border rounded-md w-full"
          >
            <p>Account {index + 1}</p>
            {account.tokens.map((token, ind) => (
              <div key={ind} className="flex flex-col gap-1 w-full">
                <div className="flex flex-row items-center gap-2 w-full">
                  <Image
                    src={`/${token.symbol}.png`}
                    height={30}
                    width={30}
                    alt="logo"
                    className="rounded-full"
                  />
                  <p>{token.name}</p>
                  <div className="ml-auto">
                    <PrivateKeyDialog
                      account={index + 1}
                      tokenName={token.name}
                      pvtkey={token.privateKey}
                      symbol={token.symbol}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <p>
                    {token.publicKey.slice(0, 3)}...
                    {token.publicKey.slice(
                      token.publicKey.length - 3,
                      token.publicKey.length
                    )}
                  </p>
                  <button
                    onClick={() => handleCopy(token.publicKey)}
                    className="active:text-green-400"
                  >
                    <Copy size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;

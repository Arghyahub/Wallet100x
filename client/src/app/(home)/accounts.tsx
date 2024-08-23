"use client";
import useWalletStore, { AccountType, tokenType } from "@/states/wallet";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import React, { useEffect, useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { ethers } from "ethers";
import Image from "next/image";
import { Copy } from "lucide-react";
import PrivateKeyDialog from "./privatekey-dialog";
import { Button } from "@/components/ui/button";
import GenerateMultipleAcc from "./generate-multipleacc";
import constants from "@/constants";

const SERVER = constants.SERVER;

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
  const [BalanceRelation, setBalanceRelation] = useState<{
    [key: string]: number;
  }>({});

  async function generateMultipleAccounts(n: number, append = false) {
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
      console.log(accountEth.privateKey);
      const privateEth = accountEth.privateKey;
      const wallet = new ethers.Wallet(privateEth);
      const publicEth = wallet.address;

      createAccounts.push({
        name: `Account ${i + 1}`,
        tokens: [
          {
            name: "Solana",
            symbol: "SOL",
            publicKey: publicSol,
            privateKey: privateSol,
            balance: -1,
          },
          {
            name: "Ethereum",
            symbol: "ETH",
            publicKey: publicEth,
            privateKey: privateEth,
            balance: -1,
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

  async function handleAccountsFetch() {
    const BalanceRelationCpy = {} as typeof BalanceRelation;
    for (let i = 0; i < accounts.length; i++) {
      const solToken = accounts[i].tokens[0];
      const ethToken = accounts[i].tokens[1];

      let solBalance = -1;
      let ethBalance = -1;

      try {
        const solresp = fetch(
          `${SERVER}/sol/balance/${solToken.publicKey}/devnet`
        );
        const ethresp = fetch(
          `${SERVER}/eth/balance/${ethToken.publicKey}/sepolia`
        );

        const [solRespAwait, ethRespAwait] = await Promise.all([
          solresp,
          ethresp,
        ]);
        const solData = await solRespAwait.json();
        const ethData = await ethRespAwait.json();

        solBalance = solData?.data?.result?.value;
        ethBalance = ethData?.data?.result;
      } catch (error) {
        console.log(error);
      }
      if (solBalance != -1)
        BalanceRelationCpy[solToken.publicKey] = solBalance / LAMPORTS_PER_SOL;
      if (ethBalance != -1)
        BalanceRelationCpy[ethToken.publicKey] = Number(ethBalance) / 1e18;
    }
    console.log(BalanceRelationCpy);
    setBalanceRelation(BalanceRelationCpy);
    // const accountsCopy = [...accounts];
    // const promises = accountsCopy.map(async (account, index) => {
    //   account.tokens.map(async (token, ind) => {
    //     if (token.name === "Solana") {
    //       fetch(`${SERVER}/sol/balance/${token.publicKey}/devnet`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //           accountsCopy[index].tokens[ind].balance =
    //             data?.data?.result?.value;
    //         })
    //         .catch((err) => (accountsCopy[index].tokens[ind].balance = -2));
    //     } else {
    //       fetch(`${SERVER}/eth/balance/${token.publicKey}/sepolia`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //           accountsCopy[index].tokens[ind].balance = data?.data?.result;
    //         })
    //         .catch((err) => (accountsCopy[index].tokens[ind].balance = -2));
    //     }
    //   });
    // });
    // await Promise.all(promises);
    // console.log("accounts\n", accounts);
    // console.log("accountsCopy\n", accountsCopy);
    // if (JSON.stringify(accounts) !== JSON.stringify(accountsCopy)) {
    //   setAccounts(accountsCopy);
    // }
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

  useEffect(() => {
    if (ISSERVER) return;
    if (
      accounts.length > 0 &&
      accounts.some((account) => account.tokens[0].balance == -1)
    ) {
      handleAccountsFetch();
    }
  }, [accounts]);

  if (!mnemonic) return <></>;

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
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
            Delete Wallets
          </Button>
        </div>
      </div>
      <div className="flex flex-col mt-1 w-full h-full overflow-y-auto">
        {accounts.map((account, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 border-slate-600 p-2 border rounded-md w-full"
          >
            <p>Account {index + 1}</p>
            {account.tokens.map((token, ind) => (
              <div key={ind} className="flex flex-col gap-1 mb-2 w-full">
                <div className="items-center gap-2 grid grid-cols-[130px,1fr,auto] w-full">
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      src={`/${token.symbol}.png`}
                      height={30}
                      width={30}
                      alt="logo"
                      className="rounded-full"
                    />
                    <p>{token.name}</p>
                  </div>
                  {BalanceRelation[token.publicKey] != undefined ? (
                    <p>
                      {`${BalanceRelation[token.publicKey]} ${token.symbol}`}
                    </p>
                  ) : (
                    <p className="bg-gray-700 py-1 p-2 rounded-lg w-7 text-center animate-pulse"></p>
                  )}
                  {/* <p>{token.balance == -1 ? "ok" : `${token.balance}`}</p> */}
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

import Navbar from "@/components/navbar/navbar";
import React from "react";
import GenerateWallet from "./(home)/generate-wallet";
import useWalletStore from "@/states/wallet";
import Accounts from "./(home)/accounts";
import ConnectionCheck from "./(home)/connection-check";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="flex flex-col items-center bg-[#282828] w-full h-[100svh]">
      <Navbar />
      <div className="flex flex-col gap-3 border-white px-5 md:px-3 py-5 w-full md:max-w-[1000px] h-full text-white">
        <ConnectionCheck />
        <h1 className="w-full font-semibold text-2xl text-center md:text-4xl">
          Welcome to{" "}
          <span className="font-bold font-sans text-green-200">Wallet100x</span>{" "}
        </h1>
        <GenerateWallet />
        <Accounts />
      </div>
    </div>
  );
};

export default Home;

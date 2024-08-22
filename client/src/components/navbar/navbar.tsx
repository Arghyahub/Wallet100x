import { WalletMinimal } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="flex flex-row bg-slate-800 px-3 py-4 w-full text-white">
      <Link className="flex flex-row items-center gap-2" href="/">
        <WalletMinimal />
        <h1 className="font-semibold text-xl">Wallet100x</h1>
      </Link>
    </div>
  );
};

export default Navbar;

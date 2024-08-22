import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, Lock } from "lucide-react";
import Image from "next/image";

interface Props {
  account: number;
  tokenName: string;
  pvtkey: string;
  symbol: string;
}

function PrivateKeyDialog({ account, pvtkey, symbol, tokenName }: Props) {
  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-1 px-1 py-[2px] text-black hover:text-red-500"
        >
          Private Key <Lock />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Private Key</DialogTitle>
          <DialogDescription>
            Do not share private key with anyone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2 w-full">
            <Image
              src={`/${symbol}.png`}
              height={30}
              width={30}
              alt="logo"
              className="rounded-full"
            />
            <p>{tokenName}</p>
          </div>

          {/*  */}
          <div className="relative flex flex-row">
            <p className="flex bg-slate-800 p-4 rounded-sm w-full font-thin text-white text-wrap break-all">
              {pvtkey}
            </p>
            <button
              onClick={() => handleCopy(pvtkey)}
              className="top-1 right-1 absolute text-white active:text-green-400"
            >
              <Copy size={15} />
            </button>
          </div>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

export default PrivateKeyDialog;

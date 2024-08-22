"use client";
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
import { useState } from "react";
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

interface Props {
  onClick: (n: number) => void;
}

function GenerateMultipleAcc({ onClick }: Props) {
  const [NumberOfAcc, setNumberOfAcc] = useState(5);
  const [Open, setOpen] = useState(false);
  return (
    <Dialog open={Open}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button
          variant="secondary"
          className="px-2 py-1 text-[10px] sm:text-xs md:text-base"
        >
          Add multiple accounts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add multiple accounts</DialogTitle>
          <DialogDescription>
            Bulk create multiple accounts at once
          </DialogDescription>
        </DialogHeader>
        <div className="gap-4 grid py-4">
          <input
            type="number"
            onChange={(e) => setNumberOfAcc(Number(e.target.value))}
            className="bg-slate-100 px-2 py-2 w-full"
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              onClick(NumberOfAcc);
              setOpen(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateMultipleAcc;

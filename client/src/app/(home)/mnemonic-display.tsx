"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Copy } from "lucide-react";
import { useState } from "react";

type Props = {
  mnemonic: string;
};

function MnemonicDisplay({ mnemonic }: Props) {
  const [Copied, setCopied] = useState(false);
  function copyMnemonic() {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
  }
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="item-1"
        className="border-b-slate-600 ring-0 outline-none"
      >
        <AccordionTrigger className="ring-0 md:text-2xl hover:no-underline outline-none">
          Your Mnemonic
        </AccordionTrigger>
        <AccordionContent className="flex flex-row gap-2 ring-0 outline-none">
          <div className="flex flex-row flex-wrap gap-3 w-full">
            {mnemonic.split(" ").map((word, index) => (
              <p key={index} className="bg-slate-600 px-2 py-1 rounded-md">
                {word}
              </p>
            ))}
          </div>
          <button onClick={copyMnemonic}>
            <Copy color={Copied ? "#bef382" : "white"} />
          </button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default MnemonicDisplay;

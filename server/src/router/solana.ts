import { Router } from "express";
import config from "../constants";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Solana!");
});

router.get("/balance/:address/:networkType", async (req, res) => {
  const { address, networkType } = req.params;
  console.log(req.params);
  try {
    const resp = await fetch(
      `https://solana-${networkType}.g.alchemy.com/v2/${config.API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [address],
        }),
      }
    );

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data);
    }

    // console.log(res);
    return res.status(200).json({ message: "Success", data });
  } catch (error) {
    console.log("==/sol/balance/...\n", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

export default router;

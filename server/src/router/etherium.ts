import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Eth!");
});

router.get("/balance/:address/:networkType", async (req, res) => {
  const { address, networkType } = req.params;
  try {
    const resp = await fetch(
      `https://eth-${networkType}.g.alchemy.com/v2/demo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [address],
        }),
      }
    );

    if (!resp.ok) {
      console.log("Server Error", resp);
    }

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data);
    }

    // console.log(res);
    return res.status(200).json({ message: "Success", data });
  } catch (error) {
    console.log(error);
    console.log("==/eth/balance/...\n", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

export default router;

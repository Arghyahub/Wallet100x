import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Arghya!");
});

// ================== Importing Routes ==================
import { etheriumRouter, solanaRouter } from "./router";
app.use("/SOL", solanaRouter);
app.use("/ETH", etheriumRouter);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

import express, { Express } from "express";
import cors from "cors";
import subProcess from "child_process";

const app: Express = express();
const port = 3000;
app.use(express.json());

app.use(cors({ origin: "*", exposedHeaders: "Content-Type" }));
app.options("*", cors());

app.get("/", async (_, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.send("Welcome to the server");
});

app.post("/message", (req, res) => {
  // res.set("Access-Control-Allow-Origin", "*");
  const { message } = req.body;
  console.log(`[server] Message received: ${message}`);

  // Spawn a shell and execute cowsay with the message as input
  subProcess.exec(`cowsay ${message}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`[cowsay] Error: ${err.message}`);
      res.status(500).send(`Error: ${err.message}`);
    } else if (stderr) {
      console.error(`[cowsay] Error: ${stderr}`);
      res.status(500).send(`Error: ${stderr}`);
    } else {
      console.log(`[cowsay] Child process exited with code ${stdout}`);
      res.send({ stdout });
    }
  });
});

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const child_process_1 = __importDefault(require("child_process"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*", exposedHeaders: "Content-Type" }));
app.options("*", (0, cors_1.default)());
app.get("/", async (_, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.send("Welcome to the server");
});
app.post("/message", (req, res) => {
    // res.set("Access-Control-Allow-Origin", "*");
    const { message } = req.body;
    console.log(`[server] Message received: ${message}`);
    // Spawn a shell and execute cowsay with the message as input
    child_process_1.default.exec(`cowsay ${message}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`[cowsay] Error: ${err.message}`);
            res.status(500).send(`Error: ${err.message}`);
        }
        else if (stderr) {
            console.error(`[cowsay] Error: ${stderr}`);
            res.status(500).send(`Error: ${stderr}`);
        }
        else {
            console.log(`[cowsay] Child process exited with code ${stdout}`);
            res.send({ stdout });
        }
    });
});
app.listen(port, () => {
    console.log(`[server] Server is running at http://localhost:${port}`);
});

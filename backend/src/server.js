
import env from "./config/env.js";
import express from "express";
import { Bootstrap } from "./app.controller.js";


const app = express();
const port = env.port;


await Bootstrap(app, express)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

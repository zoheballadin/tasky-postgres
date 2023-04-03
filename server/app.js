import express from "express";
import config from "config"
import dbConnect from "./dbConnect.js";

import userRoutes from "./controllers/users/index.js"
import taskRoutes from "./controllers/tasks/index.js"

import {dirname} from "path"
import {fileURLToPath} from "url"
import path from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

const port = config.get("PORT")

const app = express();


app.use(express.json())
app.use("/api/user", userRoutes)
app.use("/api/task", taskRoutes)

app.use(express.static(path.join(__dirname,  "build")));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname,  "build", "index.html"));
    // console.log(path.join(__dirname, "..", "tasky-client", "build", "index.html"))
  });


app.listen(port, ()=>{
    console.log("Listening on ",port)
})


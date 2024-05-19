const express = require("express");
const cors = require("cors");
const EventEmitter = require('events');
const {notFound,errorHandler} = require("./Middlewares/errorHandler.js");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

const authRoute = require("./Routes/authRoute.js");
const workFlowRoute = require("./Routes/worfFlowRoute.js");

const emitter = new EventEmitter();
emitter.setMaxListeners(15);

const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req,res)=>{
    return res.status(200).send({message: "Welcome to Flowen backend server..."})
});

app.use("/api/auth", authRoute);
app.use("/api/workflow", workFlowRoute);

app.use(notFound);
app.use(errorHandler);

process.on("warning", (warning)=>{
    console.warn(warning.stack);
});

app.listen(PORT, ()=>{
    console.log("Server is running on PORT: " + PORT);
})
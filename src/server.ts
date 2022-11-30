import express from "express";
import router from "./router";
import morgan from "morgan";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res, next) => {
    res.json({message: "Hit the base"});
});

app.use("/api", protect, router);

app.post("/user", createNewUser);
app.post("/signin", signIn);

app.use((err, req, res, next) => {
    if (err.type === "auth") {
        res.status(401).json({message: "Unauthorized"});
    } else if (err.type === "input") {
        res.status(400).json({message: "Invalid Input"});
    } else {
        res.status(500).json({message: "Oops that's on us"});
    }
});

export default app;
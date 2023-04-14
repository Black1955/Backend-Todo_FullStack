import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import * as userControllers from "./utils/userControllers.js";
import * as tasksControllers from "./utils/tasksControllers.js";
import checkAuth from "./checkAuth.js";
import User from "./models/User.js";
const PORT = process.env.PORT || 5000;
const app = express();

dotenv.config();
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());

// MONGODB CONNECT
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_CONNECT, () =>
  console.log("DATABASE WAS CONNECTED")
);

//PATHS
app.post("/auth/register", userControllers.register);
app.post("/auth/login", userControllers.login);
app.delete("/user/:id", checkAuth, userControllers.removeUser);
app.get("/user/:id", checkAuth, userControllers.getUserData);
app.post("/tasks", checkAuth, tasksControllers.createTask);
app.get("/tasks/:id", checkAuth, tasksControllers.getAll);
app.patch("/tasks", checkAuth, tasksControllers.update);
app.post("/auth/token", userControllers.getUserId);
app.post("/tasks/:color", tasksControllers.getByColor);
app.get("/", checkAuth, (req, res) => {
  try {
    const users = User.find().limit(2);
    // console.log(users)
    res.json({ users: users });
  } catch (e) {
    res.status(404).json({ message: "error" });
  }
});

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`SERVER START ON PORT:${PORT}`);
});

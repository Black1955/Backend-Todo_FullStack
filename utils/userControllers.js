import bcrypt from "bcrypt";
import Users from "../models/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Task from "../models/Task.js";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password, imageURL } = req.body;

    const uniqueEmail = await Users.findOne({ email: email });
    if (uniqueEmail) {
      return res.status(404).json({ message: "user already register" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new Users({
      name,
      email,
      password: hash,
      imageURL,
    });
    await newUser.save();
    const token = jwt.sign(
      {
        _id: newUser._id,
      },
      "Oleg",
      {
        expiresIn: "31d",
      }
    );

    res.json({ ...newUser._doc, token });
  } catch (e) {
    res.status(404).json({ message: "error" });
    console.log(e);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    const isCorrectPassword = await bcrypt.compare(
      password,
      user._doc.password
    );
    if (!user) {
      return res.status(404).json({ message: "incorrect email or pasword" });
    }
    if (!isCorrectPassword) {
      return res.status(404).json({ message: "incorrect email or pasword" });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "Oleg",
      {
        expiresIn: "31d",
      }
    );
    res.json({ ...user._doc, token });
  } catch (e) {
    res.status(404).json({ message: "error" });
  }
};
export const removeUser = (req, res) => {
  try {
    const userId = req.userID;

    Users.findByIdAndDelete({ userId }, (err, doc) => {
      if (err) {
        return res.status(404).json({ message: "error" });
      }
      if (!doc) {
        return res.status(404).json({ message: "user does`t found" });
      }
    });
    res.json({ message: "user deleted successful" });
  } catch (e) {
    res.status(404).json({ message: "error" });
  }
};
export const getUserData = async (req, res) => {
  try {
    const user = await Users.findById(req.userID);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    // const { name, imageURL } = user;
    res.json(user);
  } catch (e) {
    res.status(404).json({ message: "error" });
  }
};
export const getUserId = async (req, res) => {
  try {
    const { token } = req.body;
    let id = "";
    jwt.verify(token, "Oleg", async (err, decoded) => {
      if (err) {
        res.status(404).json({ message: "encoding was rejected" });
      }
      const { _id } = decoded;
      id = _id;
    });
    const tasks = await Task.find({ user: id });
    // console.log({tasks})
    res.json({ id: id, tasks: tasks });

    console.log(req.body);
  } catch (e) {
    res.status(404).json({ message: "something went wrong" });
  }
};

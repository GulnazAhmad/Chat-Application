import express from "express";
import User from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//import { userInfo } from "os";
import { unlinkSync } from "fs";
//import { Console } from "console";
import path from "path";
const createtoken = (email, userId) => {
  return jwt.sign(
    {
      id: userId,
      email: email,
    },
    process.env.SECRET,
    {
      expiresIn: "3d",
    }
  );
};
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already registered" });
    }
    if (!email || !password) {
      return res.status(400).json("all fileds are required");
    }
    //creating hashed pw
    const salt = await bcrypt.genSalt(10);
    const hashpw = await bcrypt.hashSync(password, salt);
    let user = await User.create({
      email: email,
      password: hashpw,
    });

    const token = createtoken(email, user._id);
    res.cookie("jwttoken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      profileSetup: user.profileSetup,
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json(e.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json("user not found");
    }
    let match = await bcrypt.compareSync(password, user.password);
    if (!match) {
      console.log("wrong password");
      return res.status(409).json("wrong password");
    }
    const token = createtoken(user.email, user._id); // ✅ Generate JWT

    res.cookie("jwttoken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    //Take the password field out of user._doc, and store everything else in a new object called info.
    const { password: _, ...info } = user._doc;
    res.status(200).json(info);
  } catch (e) {
    console.log(e.mesaage);
    res.status(500).json(e.message);
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwttoken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.status(200).json("logged out successfully");
  } catch (e) {
    console.log(e.message);
    res.status(500).json(e.message);
  }
};
export const refetch = async (req, res) => {
  console.log("/refetch hit");
  const token = req.cookies.jwttoken;
  console.log(token);
  if (!token) return res.status(401).json("No token found");
  jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
    if (err) return res.status(403).json("Token is invalid");

    try {
      const user = await User.findById(data.id);
      if (!user) return res.status(404).json("User not found");

      const { password, ...info } = user._doc;
      res.status(200).json(info);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });
};

export const updateprofile = async (req, res) => {
  console.log("updating profile");
  const { id } = req.params;
  const { fullname, color } = req.body;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(404).json("user does not exist!Register to continue");
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      fullname: fullname,
      color: color,
      profileSetup: true,
    },
    { new: true } // return the updated document
  );
  return res.status(200).json(updatedUser);
};

export const addprofileimage = async (req, res) => {
  try {
    //console.log("i am inside addimage controller");
    //console.log(req.body);
    //console.log(req.file);
    if (!req.file) {
      return res.status(400).send("file is required");
    }
    const userId = req.user.id;
    //console.log(userId);
    const { fullname, color } = req.body;
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const imagePath = `/uploads/profiles/${req.file.filename}`;
    const imageUrl = `${baseUrl}${imagePath}`;

    //console.log(image);
    if (!fullname) {
      return res.status(400).send("fullname is required");
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        color,
        image: imageUrl,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    //if (image) userData.image = image;

    return res.status(200).json({
      id: userData._id,
      email: userData.email,
      fullname: userData.fullname,
      image: imageUrl,
      color: userData.color,
    });
  } catch (e) {
    console.log(e.message);

    return res.status(500).json(e.message);
  }
};
export const deleteprofileimage = async (req, res) => {
  try {
    console.log("i am in controller");
    const userId = req.user.id;
    console.log(userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("user not found");
    }
    console.log(user);

    if (user.image) {
      // Extract just the filename from the image URL
      const filename = user.image.split("/uploads/")[1]; // e.g., "profiles/abc.jpg"
      const imagePath = path.join(process.cwd(), "uploads", filename);

      try {
        unlinkSync(imagePath);
      } catch (err) {
        console.warn("Image file already deleted or not found:", err.message);
      }
    }
    user.image = null;
    await user.save();
    console.log(user);
    return res.status(200).send("profile image removed successfully.");
  } catch (e) {
    console.error(e);
    return res.status(500).json(e.message);
  }
};

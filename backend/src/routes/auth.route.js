import express from "express";
import { Router } from "express";
import {
  login,
  logout,
  signup,
  refetch,
  updateprofile,
  addprofileimage,
  deleteprofileimage,
} from "../controllers/auth.controller.js";
import { verifytoken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

const uplaod = multer({ dest: "uploads/profiles/" });
//import { signup } from "../controllers/auth.controller.js";
const authrouter = Router();

authrouter.post("/signup", signup);

authrouter.post("/login", login);

authrouter.post("/logout", logout);
authrouter.get("/refetch", verifytoken, refetch);
authrouter.put("/profile/:id", verifytoken, updateprofile);
authrouter.post(
  "/add-profile-image",
  verifytoken, //middleware
  uplaod.single("profile-image"), //multer middleware expects one file with the name/key profile-image
  addprofileimage
);
/*authrouter.delete(
  "/delete-profile-image",
  verifytoken, //middleware
  deleteprofileimage
);*/
authrouter.delete(
  "/delete-profile-image",
  verifytoken,
  (req, res, next) => {
    console.log("🛠 Route hit: delete-profile-image");
    next();
  },
  deleteprofileimage
);

export default authrouter;

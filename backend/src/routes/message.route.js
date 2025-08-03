import { Router } from "express";
import { verifytoken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadfiles } from "../controllers/message.controller.js";
import multer from "multer";

const messagesrouter = Router();
const upload = multer({ dest: "uploads/files" });

messagesrouter.post("/get-messages", verifytoken, getMessages);
messagesrouter.post(
  "/upload-file",
  verifytoken,
  upload.single("file"),
  uploadfiles
);
export default messagesrouter;

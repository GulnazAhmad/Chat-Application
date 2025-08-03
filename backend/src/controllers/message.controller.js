import { mkdirSync, renameSync } from "fs";
import Message from "../models/messages.model.js";

export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.user.id;
    const user2 = request.body.id;
    console.log("user1", user1);
    console.log("user2", user2);
    console.log("Full body:", request.body);
    if (!user1 || !user2) {
      return response.status(400).send("Both user ID's are required.");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
    return response.status(200).json({ messages });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const uploadfiles = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).json("file is required");
    }
    console.log(request.file);
    const date = Date.now();
    let filedir = `uploads/files/${date}`;
    let filename = `${filedir}/${request.file.originalname}`;

    mkdirSync(filedir, { recursion: true }); //having multiple images in same dir then creating new dir for new date
    renameSync(request.file.path, filename);
    return response.status(200).json({ filepath: filename });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

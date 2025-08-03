import React, { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerFill } from "react-icons/ri";
import { IoSendSharp } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "../Context/SocketContext";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api_client";
import { UPLOAD_FILE_ROUTE } from "../../util/constant.js";

const Messagebar = () => {
  const { selectedChatData, selectedChatType } = useAppStore.getState();
  const { userInfo } = useAppStore();
  const emojiref = useRef();
  const fileinputref = useRef(); //sets current to null
  const [emojipickeropen, setEmojipickeropen] = useState(false);
  const [message, setMessage] = useState("");
  const socket = useSocket();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiref.current && !emojiref.current.contains(event.target)) {
        setEmojipickeropen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiref]);

  const handlesendmessage = async () => {
    if (!userInfo?._id || !selectedChatData?._id || !selectedChatType) {
      console.error("Missing required fields");
      return;
    }

    const payload = {
      sender: userInfo?._id,
      content: message,
      recipient: selectedChatData._id,
      messageType: "text",
      fileUrl: undefined,
    };

    if (socket) {
      console.log("📤 Sending message:", payload);
      if (selectedChatType === "contact") {
        socket.emit("sendMessage", payload);
      }
      setMessage("");
    } else {
      console.error("Socket is not connected yet. Message not sent.");
    }
  };

  const handleaddemoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleAttachmentClick = () => {
    if (fileinputref.current) {
      fileinputref.current.click();
    }
  };
  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        console.warn("No file selected");
        return;
      }
      console.log("Preparing to upload file:", file);

      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
        withCredentials: true,
      });
      console.log("Upload response:", res);

      if (res.status === 200 && res.data) {
        const fileUrl =
          res.data.filePath ||
          res.data.filepath ||
          res.data.fileUrl ||
          res.data.file; // normalize
        if (selectedChatType === "contact" && socket) {
          const payload = {
            sender: userInfo?._id,
            content: undefined,
            recipient: selectedChatData._id,
            messageType: "file",
            fileUrl,
          };
          socket.emit("sendMessage", payload);

          setMessage("");
          console.log("Sent file message payload:", payload);
        }
      }
    } catch (e) {
      console.log("attachment upload error", e.message);
    }
  };
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-5 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md gap-5 pr-5 items-center">
        <input
          type="text"
          placeholder="Enter a message"
          className="flex-1 p-5 bg-transparent rounded-md focus:outline-none text-white"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlesendmessage();
            }
          }}
        />
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 hover:text-white duration-300 transition-all "
        >
          <GrAttachment className="text-3xl" />
        </button>
        <input
          type="file"
          ref={fileinputref}
          className="hidden"
          onChange={(e) => handleAttachmentChange(e)}
        />
        <div className="relative">
          <button
            onClick={() => setEmojipickeropen(true)}
            className="text-neutral-500 hover:text-white duration-300 transition-all"
          >
            <RiEmojiStickerFill className="text-3xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiref}>
            {" "}
            <EmojiPicker
              theme="dark"
              open={emojipickeropen}
              onEmojiClick={handleaddemoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handlesendmessage}
        className="bg-[#8417ff]/80 rounded-md hover:bg-[#8417ff] p-5 flex items-center justify-center text-white duration-300 transition-all"
      >
        <IoSendSharp className="text-2xl" />
      </button>
    </div>
  );
};
export default Messagebar;

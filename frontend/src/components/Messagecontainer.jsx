import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import moment from "moment";
import { apiClient } from "@/lib/api_client";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "../../util/constant.js";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
const Messagecontainer = () => {
  const {
    selectedChatMessages,
    selectedChatType,
    selectedChatData,
    setSelectedChatMessages,
  } = useAppStore();
  const scrollRef = useRef(null);
  const [enlargeImage, setEnlargeImage] = useState(null);
  console.log("selectedchat data", selectedChatData);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|gif|png|tiff|tif|webp|svg|ico|heic|heif)$/i; //we are using regex literal here
    return imageRegex.test(filePath); //.test() returns true if the string matches the pattern, false otherwise.
  };

  const downloadFile = async (url) => {
    const response = await apiClient.get(`${HOST}/${url}`, {
      //even though i have'nt defined this route in backed express.static will resolve it.
      responseType: "blob",
    });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data])); //This URL can be used in DOM elements (like <a> or <img>) to access/download the content without uploading it somewhere.
    const link = document.createElement("a"); //Dynamically creates an anchor element. This will be used to trigger the browser’s native “save as” behavior.
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop()); //add the download attribute to download the resource instead of navigating to it
    //extracts the filename from the original url string to suggest as the saved filenname
    document.body.appendChild(link); //the anchor tag is appended into the body to work
    link.click(); //programatically clcik download to start download
    link.remove(); //then remove the anchor tag
    window.URL.revokeObjectURL(urlBlob); //release the memory associated with blob memory
  };

  const clickedImage = async (url) => {
    setEnlargeImage(`${HOST}/${url}`);
  };
  const renderDMMessages = (message) => {
    const senderId =
      typeof message.sender === "object" ? message.sender._id : message.sender;
    const selectedId = selectedChatData?._id;
    const isIncoming = senderId !== selectedId;

    // selectedChatData is for receiver
    return (
      <div className={`${isIncoming ? "text-left" : "text-right"}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              isIncoming
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              isIncoming
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div className="cursor-pointer">
                <img
                  onClick={() => clickedImage(message.fileUrl)}
                  src={`${HOST}/${message.fileUrl}`}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8- text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  onClick={() => downloadFile(message.fileUrl)}
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 duration-300 transition-all"
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id || index}>
          {showDate && (
            <div className="text-center text-gray-500 my-3">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
        {renderMessages()}
        <div ref={scrollRef} />
      </div>

      {enlargeImage && (
        <div
          onClick={() => setEnlargeImage(null)}
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
        >
          <div className="relative">
            <img
              src={enlargeImage}
              className="max-h-[90vh] max-w-[90vw] object-contains"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                const relativeURL = enlargeImage.replace(`${HOST}/`, "");
                downloadFile(relativeURL);
              }}
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-300"
            >
              <IoMdArrowRoundDown size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Messagecontainer;

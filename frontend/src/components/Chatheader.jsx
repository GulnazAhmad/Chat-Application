import { useAppStore } from "@/store";
import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "../lib/utils";
//import { HOST } from "util/constant";
const Chatheader = () => {
  const { closeChat, selectedChatData } = useAppStore();
  //console.log(selectedChatData);
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-center px-20">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center ">
          <div className="w-12 h-12 relative">
            <Avatar className="w-12 h-12 rounded-full overflow-hidden relative">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full rounded-4xl"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  <span className="">
                    {selectedChatData.fullname
                      ? selectedChatData.fullname[0]
                      : selectedChatData.email[0]}
                  </span>
                </div>
              )}
            </Avatar>
          </div>
          <span className="text-2xl font-bold">
            {" "}
            {selectedChatData.fullname || selectedChatData.email}
          </span>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <button
            className="text-neutral-500 focus:border-null outline-null focus:text-white duration-300 trasition-all "
            onClick={() => closeChat()}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatheader;

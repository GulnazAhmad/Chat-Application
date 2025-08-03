import { useAppStore } from "@/store";
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LuBotMessageSquare } from "react-icons/lu";
import { IoMdPerson } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import Chatcontainer from "@/components/Chatcontainer";
import Contactscontainer from "@/components/Contactscontainer";
import Emptychatconatiner from "@/components/Emptychatconatiner";
import { apiClient } from "@/lib/api_client";
import { LOGOUT_ROUTE } from "../../util/constant";
import { GiConsoleController } from "react-icons/gi";
import { createChatSlice } from "@/store/slices/chat-slice";
const Chat = () => {
  const { selectedChatType, userInfo } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue");
      console.log("profile user", userInfo);
      navigate(`/profile/${userInfo._id}`);
    }
  });
  const handlelogout = async () => {
    try {
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      console.log(res);

      if (res.status === 200) {
        //console.log("Navigating to /auth..."); // ✅ make sure this runs
        //console.log(userInfo);
        useAppStore.setState({ userInfo: null });
        //console.log(userInfo);

        navigate("/auth");
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div>
      {/*navigation*/}
      <div className="bg-gray-900 flex p-3 h-[7vh] items-center text-white">
        <div className="flex p-8 gap-2">
          <LuBotMessageSquare size="30" />
          <p className="font-bold ">Chitchat</p>
        </div>
        <div className="items-center gap-4 flex ml-auto">
          <div className="flex items-center gap-1">
            <IoMdPerson />
            <Link to={`/profile/${userInfo._id}`}>profile</Link>
          </div>

          <div className="flex items-center gap-1">
            <IoSettings />
            <Link>Settings</Link>
          </div>
          <div className="flex items-center gap-1">
            <MdLogout />
            <h3 className="font-bold cursor-pointer" onClick={handlelogout}>
              Logout
            </h3>
          </div>
        </div>
      </div>
      <div className="flex h-[100vh] text-white overflow-hidden">
        <Contactscontainer />
        {selectedChatType === undefined ? (
          <Emptychatconatiner />
        ) : (
          <Chatcontainer />
        )}
      </div>
    </div>
  );
};

export default Chat;

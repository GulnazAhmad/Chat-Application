import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { useAppStore } from "@/store";
import { HOST } from "../../util/constant";
import { colors } from "@/lib/utils";
const Profileinfo = () => {
  const { userInfo } = useAppStore();
  //console.log(userInfo);
  //console.log(userInfo.fullname);

  return (
    <div className="h-16 flex items-center justify-between px-4 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center ">
        <Avatar className="h-12 w-12  rounded-full overflow-hidden">
          {userInfo.image ? (
            <AvatarImage
              src={userInfo.image}
              alt="profile"
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <div
              className={`uppercase h-12 w-12 text-lg border flex items-center justify-center rounded-full ${userInfo.color}`}
            >
              {userInfo.fullname
                ? userInfo.fullname.charAt(0)
                : userInfo?.email?.charAt(0)}
            </div>
          )}
        </Avatar>
        <div className="text-white">
          <p className="font-medium text-sm">
            {userInfo.fullname || "Unnamed User"}
          </p>
          <p className="text-xs text-gray-400">{userInfo.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profileinfo;

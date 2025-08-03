import React, { useRef, useState } from "react";
import { useAppStore } from "@/store";
import { IoArrowBack } from "react-icons/io5"; // ✅ added missing import
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors } from "@/lib/utils";
import { PROFILE_ROUTE } from "../../util/constant.JS";
import { apiClient } from "@/lib/api_client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ADD_PROFILE_IMAGE_ROUTE } from "../../util/constant.js";
import { DELETE_PROFILE_IMAGE_ROUTE } from "../../util/constant.js";
const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const [fullname, setFullname] = useState(userInfo.fullname || "");
  const [image, setImage] = useState(userInfo.image) || null;

  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo.color || 0);

  //console.log(userInfo);
  //console.log(userInfo._id);
  //console.log(`${PROFILE_ROUTE}/${userInfo._id}`);

  const saveChanges = async () => {
    try {
      const res = await apiClient.put(`${PROFILE_ROUTE}/${userInfo._id}`, {
        fullname: fullname,
        color: selectedColor,
      });
      console.log(res.data);
      if (res.status == 200) {
        setUserInfo(res.data);
        toast.success("Profile setup successful!");

        navigate("/chat");
      }
      console.log(res);
    } catch (e) {
      toast.error("Something went wrong");
      console.log(e.message);
    }
    // Handle save logic here
  };
  const handlefileInputClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log({ file });
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file); // ✅ image
      formData.append("fullname", fullname); // ✅ must match req.body.fullname
      formData.append("color", selectedColor); // ✅ must match req.body.color

      try {
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 200 && res.data.image) {
          const imageUrl = res.data.image; // 👈 prepend server URL

          setUserInfo({ ...userInfo, image: imageUrl });
          setImage(imageUrl);
          toast.success("Image updated successfully");
        }
      } catch (e) {
        toast.error("Image upload failed");
        console.log("upload error", e.message);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      console.log(DELETE_PROFILE_IMAGE_ROUTE);
      const res = await apiClient.delete(DELETE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        setImage(null); // ✅ Also update local state
        toast.success("Image deleted successfully");
      }
    } catch (e) {
      toast.error("Image deletion failed");
      console.log("error is in me", e.message);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>

        <div className="grid grid-cols-2 gap-10">
          {/* Avatar */}
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 relative flex items-center justify-center">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black rounded-full"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl flex items-center justify-center rounded-full ${colors[selectedColor]}`}
                >
                  {fullname ? fullname.charAt(0) : userInfo?.email?.charAt(0)}
                </div>
              )}
            </Avatar>

            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                onClick={image ? handleDeleteImage : handlefileInputClick}
              >
                {image ? (
                  <FaTrash className="text-3xl cursor-pointer text-white" />
                ) : (
                  <FaPlus className="text-3xl cursor-pointer text-white" />
                )}
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            name="profile-image"
            accept=".png ,.jpg ,.jpeg ,.svg ,.webp"
          />

          {/* Form Fields */}
          <div className="flex flex-col gap-5 text-white items-center justify-center min-w-32 md:min-w-64">
            <Input
              placeholder="Email"
              type="email"
              disabled
              value={userInfo?.email}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />

            <Input
              placeholder="Full Name"
              type="text"
              onChange={(e) => setFullname(e.target.value)}
              value={fullname}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />

            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-1"
                      : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>

            <Button
              className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={saveChanges}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

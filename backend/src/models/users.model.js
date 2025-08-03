import mongoose from "mongoose";
import { type } from "os";

const Userschema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    fullname: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6,
    },
    image: {
      type: String,
    },
    color: {
      type: Number,
    },
    profileSetup: {
      type: Boolean,
      default: false,
    },
  },
  { timeStamps: true }
);

const User = mongoose.model("User", Userschema);
export default User;

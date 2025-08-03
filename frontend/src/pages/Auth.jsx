import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GiPeaceDove } from "react-icons/gi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api_client";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "../../util/constant.js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/index.js";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const validateSignup = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };
  const validateLogin = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    try {
      const res = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      //console.log(res);
      if (res.status == 201) {
        setUserInfo(res.data);

        navigate(`/profile/${res.data.id}`);
      }
      console.log(res);
      toast.success("Signup successful!");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("User already registered");
      } else {
        toast.error("Signup failed. Please try again.");
        console.error(err);
      }
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      const res = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        {
          withCredentials: true,
        }
      );
      //console.log(res.data);
      if (res.data._id) {
        setUserInfo(res.data);
        if (res.data.profileSetup) navigate("/chat");
        else navigate("/profile");
      }
      //console.log(res);
      toast.success("Login successful!");
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error("user not found");
      } else if (err.response && err.response.status === 409) {
        toast.error("password is wrong!");
      }

      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Column - Form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <GiPeaceDove className="text-purple-600 text-4xl" />
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to Chitchat
            </h1>
          </div>
          <p className="text-center text-gray-600 mb-8">
            Connect with your friends,family,community in a peaceful environment
          </p>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full bg-gray-100 rounded-lg p-1 mb-6">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-3 transition-all"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-3 transition-all"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form className="space-y-4">
                <Input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg py-5 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg py-5 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <Button
                  type="submit"
                  onClick={handleLogin}
                  className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-semibold text-lg shadow-md transition-all"
                >
                  Login
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-600">
                <a href="#" className="text-purple-600 hover:text-purple-800">
                  Forgot password?
                </a>
              </div>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <Input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg py-5 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg py-5 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <Input
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-lg py-5 px-4 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                <Button
                  type="submit"
                  className="w-full py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg font-semibold text-lg shadow-md transition-all"
                >
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Image */}
        <div className="hidden lg:flex bg-gradient-to-br from-purple-100 to-indigo-100 items-center justify-center p-8">
          <img
            src="https://i.pinimg.com/736x/37/81/e5/3781e56e85bf7682018acb4d22429a94.jpg"
            alt="Peaceful communication illustration"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;

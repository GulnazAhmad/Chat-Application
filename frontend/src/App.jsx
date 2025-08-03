import "./App.css";
import { Button } from "./components/ui/button";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/Chat";
import Profile from "./pages/profile";
import { useEffect, useState } from "react";
//import { Toaster } from "sonner";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api_client";
import { AUTH_ROUTES } from "../util/constant.js";

const PrivateunauthorizedchatorprofiletoauthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo; //userinfo if not undefined then isauthenticated is true
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthtochatorprofileRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children; //already authenticated and the user is tryimg to reach the auth page then it is redirected to the chat page
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchuser = async () => {
      try {
        if (!userInfo) {
          const res = await apiClient.get(AUTH_ROUTES + "/refetch", {
            withCredentials: true,
          });
          setUserInfo(res.data);
        }
      } catch (e) {
        return console.log("Refetch failed:", e.response?.data || e.message);
      } finally {
        setLoading(false); /// ✅ This ensures loading is stopped
      }
    };
    fetchuser();
  }, [setUserInfo]);
  if (loading) return <div>Loading...</div>;
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthtochatorprofileRoute>
                {/*✅ If the user is already logged in, and tries to go to /auth, they’re redirected to /chat.

✅ If the user is not logged in, they are shown the Auth component.*/}
                <Auth />
              </AuthtochatorprofileRoute>
            }
          />
          <Route
            path={`/profile/:id`}
            element={
              <PrivateunauthorizedchatorprofiletoauthRoute>
                <Profile />
              </PrivateunauthorizedchatorprofiletoauthRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateunauthorizedchatorprofiletoauthRoute>
                <Chat />
              </PrivateunauthorizedchatorprofiletoauthRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

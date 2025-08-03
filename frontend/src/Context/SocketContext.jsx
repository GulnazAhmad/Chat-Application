// socket-context.js
import { useAppStore } from "@/store";
import { HOST } from "../../util/constant";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create context
const SocketContext = createContext(null);

// Custom hook to use the socket
export const useSocket = () => {
  return useContext(SocketContext);
};

// SocketProvider
export const SocketProvider = ({ children }) => {
  const { userInfo } = useAppStore();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // 1. Ensure we have a user ID before attempting to connect.
    if (!userInfo?._id) {
      console.log("Waiting for user info to connect socket...");
      return;
    }

    // 2. Create and connect the new socket instance.
    // The 'transports' option can help prevent some CORS issues.
    const newSocket = io(HOST, {
      query: { userId: userInfo._id },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    // Update state with the new socket instance
    setSocket(newSocket);

    console.log("Attempting socket connection for user:", userInfo._id);

    // 3. Define event handlers
    const handleConnect = () => {
      console.log("✅ Socket connected:", newSocket.id);
    };

    const handleConnectError = (err) => {
      console.error("[Socket] Connection Error:", err.message);
    };

    const handleReceiveMessage = (message) => {
      // Use the store's 'getState' to get the latest state without subscribing
      const { selectedChatData, addMessage } = useAppStore.getState();

      if (!selectedChatData || !message?.sender) {
        console.log(
          "[Socket] Message received, but no active chat or sender info.",
          message
        );
        // You might want to handle notifications for non-active chats here
        return;
      }

      // Check if the message belongs to the currently open chat
      const isRelevant =
        selectedChatData._id === message.sender._id ||
        selectedChatData._id === message.recipient._id;

      if (isRelevant) {
        console.log("[Socket] Message received for the active chat:", message);
        addMessage(message);
      } else {
        console.log("[Socket] Message received for a different chat.");
        // Logic for background notifications can go here
      }
    };

    // 4. Register event listeners
    newSocket.on("connect", handleConnect);
    newSocket.on("connect_error", handleConnectError);
    newSocket.on("receiveMessage", handleReceiveMessage);

    // 5. Cleanup function: This is crucial!
    // It runs when the component unmounts or when the dependency (userInfo) changes.
    return () => {
      console.log("🔌 Disconnecting socket...");
      // Remove all listeners to prevent memory leaks
      newSocket.off("connect", handleConnect);
      newSocket.off("connect_error", handleConnectError);
      newSocket.off("receiveMessage", handleReceiveMessage);
      // Disconnect the socket
      newSocket.disconnect();
      // Clean up the state
      setSocket(null);
    };
  }, [userInfo]); // The effect depends on the entire userInfo object.

  // Always render children, providing the socket (or null if not connected)
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

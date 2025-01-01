import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import { URL } from "../../App";

export const SocketContext = createContext();

export const UseSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const { authUser } = useAuthContext();
  const [socket, setSocket] = useState(null);
  const [read, setRead] = useState([]);

  useEffect(() => {
    if (authUser && !socket) {
      const newSocket = io(`${URL}`, {
        query: {
          userId: authUser.id,
        },
      });
      setSocket(newSocket);
      // Cleanup socket connection and listeners on unmount
      return () => {
        newSocket.close();
      };
    }
    if (!authUser && socket) {
      socket.close();
      setSocket(null);
    }
  }, [authUser, socket]);

  return (
    <SocketContext.Provider value={{ socket, read }}>
      {children}
    </SocketContext.Provider>
  );
};

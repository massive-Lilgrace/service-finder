// hooks/useSocket.ts
"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(channelId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Instantiate underlying binary websocket gateway wrapper connections
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "", {
      path: "/api/socket",
      autoConnect: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      if (channelId) {
        // Namespace sync allocation room link pipeline
        socketInstance.emit("room:join", { roomId: channelId });
      }
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Cleanup active connection buffers during component unmount cycles
    return () => {
      if (channelId) {
        socketInstance.emit("room:leave", { roomId: channelId });
      }
      socketInstance.disconnect();
    };
  }, [channelId]);

  const emitEvent = (eventName: string, payload: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(eventName, payload);
    } else {
      console.warn("Socket connection is currently down. Payload held.");
    }
  };

  return { socket, isConnected, emitEvent };
}
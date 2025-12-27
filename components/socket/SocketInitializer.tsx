"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket-client";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { api } from "@/redux/api";

export default function SocketInitializer() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize the socket server
    fetch("/api/socket/io");
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join-user", user._id);

      const onNewNotification = () => {
        dispatch(api.util.invalidateTags(["Notification"]));
      };

      socket.on("new-notification", onNewNotification);

      return () => {
        socket.off("new-notification", onNewNotification);
      };
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  }, [isAuthenticated, user?._id, dispatch]);

  return null;
}

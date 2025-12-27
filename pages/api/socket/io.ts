import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!(res.socket as any).server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = (res.socket as any).server;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    (res.socket as any).server.io = io;
    (global as any).io = io;

    io.on("connection", (socket) => {
      socket.on("join-event", (eventId: string) => {
        socket.join(`event:${eventId}`);
      });

      socket.on("leave-event", (eventId: string) => {
        socket.leave(`event:${eventId}`);
      });

      socket.on("join-user", (userId: string) => {
        socket.join(`user:${userId}`);
      });
    });
  }
  res.end();
};

export default ioHandler;

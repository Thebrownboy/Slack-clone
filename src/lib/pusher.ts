import "server-only";

import PusherServer from "pusher";

const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: "eu",
  useTLS: true,
});

export default pusherServer;

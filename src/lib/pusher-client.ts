import PusherClient from "pusher-js";

const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  {
    cluster: "eu",
    authTransport: "ajax",
    auth: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  }
);

export default pusherClient;

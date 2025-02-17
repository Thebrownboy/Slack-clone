import PusherClient from "pusher-js";

const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY || "",
  {
    forceTLS: true,
    enabledTransports: ["ws", "wss"], // Ensure WebSocket support
    disabledTransports: ["sockjs"], // Avoid fallback issues
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

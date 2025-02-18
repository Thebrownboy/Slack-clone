import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: object) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send an initial event
      sendEvent({ message: "Connected to SSE" });

      // Send periodic updates (example: every 3 seconds)
      const interval = setInterval(() => {
        sendEvent({ time: new Date().toISOString() });
      }, 3000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

import { useEffect, useState } from "react";
import Button from "../components/clicker";
import vapi from "../lib/vapi.js";

const TestVapiSDKCall = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    vapi.on("call-start", () => {
      console.log("✅ Call started");
      setConnecting(false);
      setConnected(true);
    });

    vapi.on("call-end", () => {
      console.log("📴 Call ended");
      setConnected(false);
      setConnecting(false);
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        console.log(`${message.role}: ${message.transcript}`);
      }
    });

    vapi.on("error", (error) => {
      console.error("❌ Vapi error:", error);
      setConnecting(false);
      setConnected(false);
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const handleStartCall = async () => {
    setConnecting(true);
    try {
      await vapi.start({
        workflowId: import.meta.env.VITE_VAPI_WORKFLOW_ID,
      });
      console.log("🎙️ Vapi start() called");
    } catch (err) {
      console.error("❌ Failed to start Vapi call:", err);
      alert("Vapi call failed: " + err.message);
      setConnecting(false);
    }
  };

  const handleStopCall = () => {
    vapi.stop();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
      <Button
        onClick={connected ? handleStopCall : handleStartCall}
        disabled={connecting}
      >
        {connecting
          ? "Connecting..."
          : connected
          ? "End Call 📴"
          : "Start Vapi Call 🎙️"}
      </Button>

      <p className="text-sm text-muted-foreground">
        Status: {connected ? "🟢 Connected to Vapi" : "⚪ Not connected"}
      </p>
    </div>
  );
};

export default TestVapiSDKCall;

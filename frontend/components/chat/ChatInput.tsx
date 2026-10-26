"use client";

import { useState } from "react";

export default function ChatInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    alert("Message Sent: " + message);

    setMessage("");
  };

  return (
    <div className="p-6 bg-[#102433] border-t border-[#1B3448]">
      <div className="flex gap-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask NEXA AI anything..."
          className="flex-1 bg-[#1B3448] rounded-xl px-5 py-4 text-white outline-none"
        />

        <button
          onClick={handleSend}
          className="bg-emerald-500 px-8 rounded-xl text-white font-bold hover:bg-emerald-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
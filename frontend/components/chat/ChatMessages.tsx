"use client";

import { useState } from "react";

export default function ChatMessages() {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      text: input,
    };

    const aiMessage = {
      role: "ai" as const,
      text: "NEXA AI is ready. This is a fresh conversation.",
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      aiMessage,
    ]);

    setInput("");
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">

      <div className="flex-1 overflow-y-auto p-8 space-y-5">

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-5">✨</div>

            <h2 className="text-3xl font-bold text-white">
              Start a new conversation
            </h2>

            <p className="text-gray-400 mt-3">
              Ask NEXA AI anything you want.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xl rounded-2xl px-5 py-4 ${
                message.role === "user"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#102433] text-white"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

      </div>

      <div className="p-6 bg-[#102433] border-t border-[#1B3448]">

        <div className="flex gap-4">

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Ask NEXA AI anything..."
            className="flex-1 bg-[#1B3448] rounded-xl px-5 py-4 text-white outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-emerald-500 hover:bg-emerald-600 px-8 rounded-xl text-white font-bold"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}
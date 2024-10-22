"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Share, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  role: string;
  content: string;
}

export default function AIChatBox({
  fileName,
  projectName,
}: {
  fileName: string;
  projectName: string;
}) {
  const [parent] = useAutoAnimate();
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [open, setOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleSend = async () => {
    messages.push({
      role: "user",
      content: userInput,
    });
    setUserInput("");
    setMessages([...messages]);

    const resp = await fetch("/api/ai/respond", {
      method: "POST",
      body: JSON.stringify({ messages: messages, projectName, fileName }),
    });

    const data = await resp.json();
    setMessages(data);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed left-4 bottom-4 z-50" ref={parent}>
      {/* Chatbox Toggle Button */}
      <div
        className={cn(
          "cursor-pointer rounded-full w-16 h-16 bg-white text-black border flex items-center justify-center shadow-lg transition-transform duration-300 ease-in-out",
          { "translate-y-0": open, "translate-y-1/2": !open }
        )}
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "AI"}
      </div>

      {/* Chatbox Container */}
      <div
        className={cn(
          "fixed left-4 bottom-20 bg-card border rounded-xl w-[320px] max-h-[500px] shadow-xl transition-opacity duration-300 ease-in-out flex flex-col",
          { hidden: !open }
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-400"></div>
            <p className="text-sm font-semibold">ECHO AI</p>
          </div>
          <div className="flex items-center gap-1">
            <Link href={"/"} className="text-muted-foreground">
              <Button variant={"ghost"} size={"icon"}>
                <Share size={20} />
              </Button>
            </Link>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => setMessages([])}
            >
              <Trash size={20} />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          className="flex-1 overflow-auto p-2 gap-2 flex flex-col"
          ref={messagesEndRef}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("p-3 rounded-lg text-sm", {
                "bg-muted self-end text-right": message.role === "user",
                "bg-accent self-start": message.role === "assistant",
              })}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="flex items-center gap-2 p-2 border-t">
          <Input
            type="text"
            placeholder="Type a message"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSend} disabled={!userInput.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

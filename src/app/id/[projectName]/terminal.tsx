"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface Line {
  type: string;
  output: string;
}

export default function Terminal({ projectName }: { projectName: string }) {
  const [currentLine, setCurrentLine] = React.useState<string>("");
  const [lines, setLines] = React.useState<Line[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null); // For auto-focusing on the input
  const bottomRef = useRef<HTMLDivElement>(null); // For auto-scrolling to the bottom

  useEffect(() => {
    // Auto-focus on the input whenever a command is run or on initial render
    if (inputRef.current) inputRef.current.focus();
  }, [lines, loading]);

  useEffect(() => {
    // Auto-scroll to the bottom whenever lines change
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const executeCommand = async (command: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectName, command }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        return { type: "normal", output: result.output };
      } else {
        return { type: "error", output: result.output };
      }
    } catch (error) {
      setLoading(false);
      return { type: "normal", output: "Unexpected Error found" };
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedLine = currentLine.toLowerCase().trim();

      if (trimmedLine === "clear") {
        setLines([]);
        setCurrentLine("");
        setHistory([]);
        setHistoryIndex(null);
        return;
      }

      const newLines = [
        ...lines,
        { output: `# ${currentLine}`, type: "normal" },
      ];
      setLines(newLines);
      setHistory((prevHistory) => [...prevHistory, currentLine]);
      setHistoryIndex(null);
      setCurrentLine("");

      const output = await executeCommand(currentLine);

      setLines((prevLines) => [
        ...prevLines,
        {
          type: output.type,
          output: output.output,
        },
      ]);
    } else if (e.key === "ArrowUp") {
      if (historyIndex === null && history.length > 0) {
        setHistoryIndex(history.length - 1);
        setCurrentLine(history[history.length - 1]);
      } else if (historyIndex !== null && historyIndex > 0) {
        setHistoryIndex((prevIndex) => {
          if (prevIndex !== null) {
            const newIndex = prevIndex - 1;
            setCurrentLine(history[newIndex]);
            return newIndex;
          }
          return null;
        });
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex !== null && historyIndex < history.length - 1) {
        setHistoryIndex((prevIndex) => {
          if (prevIndex !== null) {
            const newIndex = prevIndex + 1;
            setCurrentLine(history[newIndex]);
            return newIndex;
          }
          return null;
        });
      } else if (historyIndex !== null && historyIndex === history.length - 1) {
        setHistoryIndex(null);
        setCurrentLine("");
      }
    }
  };

  return (
    <div className="flex flex-col bg-black text-white h-full w-full my-2 rounded-lg text-sm p-2 overflow-scroll">
      <div className="mb-2 font-bold">Shell</div>
      <div className="flex flex-col w-full gap-1 overflow-auto">
        {lines.map((line, index) => (
          <div className="flex gap-2" key={index}>
            <p
              className={cn("whitespace-pre-wrap", {
                "text-red-400": line.type === "error",
              })}
            >
              {line.output}
            </p>
          </div>
        ))}
        <div ref={bottomRef} /> {/* Auto-scroll to this element */}
      </div>
      <div className="flex items-center gap-1">
        <p
          className={cn({
            "text-muted-foreground": loading,
          })}
        >
          #
        </p>
        <input
          ref={inputRef} // Set ref to input for auto-focus
          disabled={loading}
          className="border-0 outline-none w-full bg-transparent text-white"
          onKeyDown={handleKeyDown}
          value={currentLine}
          onChange={(e) => setCurrentLine(e.target.value)}
          autoFocus
        />
        {loading && <p className="text-gray-500">Running...</p>}
      </div>
    </div>
  );
}

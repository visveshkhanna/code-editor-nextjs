"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface Line {
  type: string;
  output: string;
}

export default function Terminal({ projectName }: { projectName: string }) {
  const [currentLine, setCurrentLine] = React.useState<string>("");
  const [lines, setLines] = React.useState<Line[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

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
        return;
      }

      const newLines = [
        ...lines,
        { output: `# ${currentLine}`, type: "normal" },
      ];
      setLines(newLines);
      setCurrentLine("");

      const output = await executeCommand(currentLine);

      setLines((prevLines) => [
        ...prevLines,
        {
          type: output.type,
          output: output.output,
        },
      ]);
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

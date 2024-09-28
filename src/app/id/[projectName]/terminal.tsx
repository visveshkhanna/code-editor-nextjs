"use client";
import { set } from "date-fns";
import React from "react";

export default function Terminal() {
  const [currentLine, setCurrentLine] = React.useState<string>("");
  const [lines, setLines] = React.useState<string[]>([]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (currentLine.toLowerCase().trim() === "clear") {
        setLines([]);
        setCurrentLine("");
        return;
      }
      lines.push(currentLine);
      setLines([...lines]);
      setCurrentLine("");
    }
  };

  return (
    <div className="flex flex-col bg-black h-full  w-full my-2 rounded-lg text-sm p-2 overflow-scroll">
      <div>Docker Shell</div>
      {lines.map((line, index) => {
        return (
          <div className="flex gap-2">
            <p># </p>
            <p>{line}</p>
          </div>
        );
      })}
      <div className="flex flex-row w-full gap-2">
        <p># </p>
        <input
          className="border-0 outline-none w-full h-fit focus:ring-0 focus-visible:ring-0 bg-transparent"
          onKeyDown={handleKeyDown}
          value={currentLine}
          onChange={(e) => setCurrentLine(e.target.value)}
        />
      </div>
    </div>
  );
}

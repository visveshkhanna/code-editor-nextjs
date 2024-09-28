"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { languageMap } from "./languages";

interface CodeViewerProps {
  projectName: string;
  fileName: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ projectName, fileName }) => {
  const [code, setcode] = useState("");
  const [processing, setProcessing] = useState(false);

  const extension = fileName.split(".").pop() as string;

  // const language =

  const handleSave = async () => {
    setProcessing(true);
    const response = await fetch("/api/files/write", {
      method: "POST",
      body: JSON.stringify({ projectName, fileName, content: code }),
    });
    const data = await response.json();
    setProcessing(false);
    if (data.success) {
      alert("File saved successfully");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["code", projectName, fileName],
    queryFn: async () => {
      const response = await fetch("/api/files/read", {
        method: "POST",
        body: JSON.stringify({ projectName, fileName }),
      });
      const data = await response.json();
      setcode(data.content);
      return data.content;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Editor
        height={"100dvh"}
        value={code}
        onChange={(value, event) => {
          setcode(value as string);
        }}
        language={languageMap[extension] || "plaintext"}
        theme="vs-dark"
        options={{
          fontSize: 16,
        }}
      />
    </div>
  );
};

export default CodeViewer;

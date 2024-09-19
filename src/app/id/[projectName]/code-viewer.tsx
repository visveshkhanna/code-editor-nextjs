"use client";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface CodeViewerProps {
  projectName: string;
  fileName: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ projectName, fileName }) => {
  const [codeState, setCodeState] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSave = async () => {
    setProcessing(true);
    const response = await fetch("/api/files/write", {
      method: "POST",
      body: JSON.stringify({ projectName, fileName, content: codeState }),
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
      setCodeState(data.content);
      return data.content;
    },
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={codeState}
        onChange={(e) => setCodeState(e.target.value)}
        rows={14}
      ></Textarea>
      <Button className="w-full" onClick={handleSave}>
        {processing ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default CodeViewer;

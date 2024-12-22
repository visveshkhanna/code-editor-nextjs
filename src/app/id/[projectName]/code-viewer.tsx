"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { languageMap } from "./languages";
import { Button } from "@/components/ui/button";
import { GitCompareArrows, LoaderCircle, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CodeViewerProps {
  projectName: string;
  fileName: string;
}

function AIAutoFix({
  aip,
  handleAutoFix,
}: {
  aip: boolean;
  handleAutoFix: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div className="flex gap-2 flex-col items-end">
      <Button
        className={""}
        variant={"outline"}
        disabled={aip}
        onClick={() => setIsOpen(!isOpen)}
        size={"icon"}
      >
        {aip ? (
          <LoaderCircle size={20} className="animate-spin" />
        ) : (
          <GitCompareArrows size={20} />
        )}
      </Button>
      {isOpen && (
        <div className="z-[20] p-4 flex flex-col gap-1 rounded-lg border-white/40 border-[1px]">
          <p>Enter the way you want to fix the code</p>
          <Textarea
            rows={3}
            placeholder="Fix the error"
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            onClick={() => {
              handleAutoFix(value);
            }}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}

const CodeViewer: React.FC<CodeViewerProps> = ({ projectName, fileName }) => {
  const [code, setCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [aip, setAip] = useState(false);
  const [parent] = useAutoAnimate();
  const [editorInstance, setEditorInstance] = useState(null); // Store editor instance

  const extension = fileName.split(".").pop() as string;

  const handleAutoFix = async (value: string) => {
    setAip(true);
    const response = await fetch("/api/ai/auto", {
      method: "POST",
      body: JSON.stringify({
        projectName,
        fileName,
        content: code,
        prompt: value,
      }),
    });
    const data = await response.json();
    refetch({});
    setAip(false);
  };

  const handleSave = async () => {
    setProcessing(true);
    const response = await fetch("/api/files/write", {
      method: "POST",
      body: JSON.stringify({ projectName, fileName, content: code || "" }),
    });
    const data = await response.json();
    refetch({});
    setProcessing(false);
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["code", projectName, fileName],
    queryFn: async () => {
      const response = await fetch("/api/files/read", {
        method: "POST",
        body: JSON.stringify({ projectName, fileName }),
      });
      const data = await response.json();
      setCode(data.content);
      return data.content;
    },
  });

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });
  };

  return (
    <div className="relative flex flex-col gap-2">
      {languageMap[extension] ? null : <p>No language found</p>}
      <div className="flex gap-2 absolute z-[20] p-3 right-2 top-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AIAutoFix aip={aip} handleAutoFix={handleAutoFix} />
            </TooltipTrigger>
            <TooltipContent>Auto FIX (AI)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          className={cn({
            hidden: code === data,
          })}
          ref={parent}
          size={"icon"}
          variant={"outline"}
          disabled={processing}
          onClick={handleSave}
        >
          {processing ? (
            <LoaderCircle size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
        </Button>
      </div>

      <Editor
        height={"100dvh"}
        value={code}
        defaultValue="Start coding..."
        loading={<p>Loading...</p>}
        onChange={(value) => {
          setCode(value || "");
        }}
        language={languageMap[extension] || "plaintext"}
        theme="vs-dark"
        options={{
          fontSize: 16,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeViewer;

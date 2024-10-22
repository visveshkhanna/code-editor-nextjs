"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateDialog({
  btn,
  projectName,
}: {
  btn: React.ReactNode;
  projectName: string;
}) {
  const [dialogopen, setDialogopen] = useState(false);
  const [input, setInput] = useState("");
  const [type, setType] = useState<string>("File");
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    setProcessing(true);
    const resp = await fetch("/api/create-child", {
      method: "POST",
      body: JSON.stringify({
        type: type,
        direct: input,
        projectName: projectName,
      }),
    });
    router.refresh();
    console.log(resp);

    setProcessing(false);
    if (type === "File") {
      router.push(`/id/${projectName}?fileName=${input}`);
    }
    setDialogopen(false);
  };

  return (
    <Dialog open={dialogopen} onOpenChange={(e) => setDialogopen(e)}>
      <DialogTrigger asChild>{btn}</DialogTrigger>
      <DialogContent>
        <p>Create file</p>
        <Label>Enter file/folder name</Label>
        <Input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="Enter"
        />
        <Select
          value={type}
          onValueChange={(e) => {
            setType(e);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="File">File</SelectItem>
            <SelectItem value="Folder">Folder</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={"outline"}
          onClick={handleCreate}
          disabled={processing}
        >
          {processing ? "Creating" : <p>Create {type}</p>}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

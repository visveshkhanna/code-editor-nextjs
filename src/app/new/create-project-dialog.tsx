import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreateProjectForm from "./create-project-form";
import React from "react";

export default function CreateProjectDialog({
  name,
  button,
}: {
  button: React.ReactNode;
  name: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent className="p-4">
        <CreateProjectForm name={name} />
      </DialogContent>
    </Dialog>
  );
}

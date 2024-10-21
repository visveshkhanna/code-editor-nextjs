"use client";
import * as React from "react";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import path from "path";
import Link from "next/link";
import CreateDialog from "./create-dialog";
type DirectoryItemType = {
  name: string;
  type: "file" | "folder";
  children?: DirectoryItemType[];
};

interface DirectoryItemProps {
  item: DirectoryItemType;
  level: number;
  currentPath: string;
}

const DirectoryItem: React.FC<DirectoryItemProps> = ({
  item,
  level,
  currentPath,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => {
    if (item.type === "folder") {
      setIsExpanded(!isExpanded);
    }
  };

  const itemPath = currentPath ? path.join(currentPath, item.name) : item.name;

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        className={` w-full justify-start px-2 py-1 text-sm font-normal ${
          level > 0 ? "pl-[20px]" : ""
        }`}
        onClick={toggleExpand}
      >
        {item.type === "folder" &&
          (isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-1" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1" />
          ))}
        {item.type === "folder" ? (
          <Folder className="h-4 w-4 mr-1" />
        ) : (
          <File className="h-4 w-4 mr-1" />
        )}
        {item.type === "file" ? (
          <Link href={`?fileName=${itemPath}`} className="text-sm select-none">
            {item.name}
          </Link>
        ) : (
          <span className="text-sm select-none">{item.name}</span>
        )}
      </Button>
      {item.type === "folder" && isExpanded && item.children && (
        <div className="ml-4">
          {item.children.map((child, index) => (
            <DirectoryItem
              key={index}
              item={child}
              level={level + 1}
              currentPath={itemPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileExplorerProps {
  data: DirectoryItemType[];
  projectName: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ data, projectName }) => {
  return (
    <div className="h-dvh flex w-full">
      <div className="w-full bg-background">
        <div className="flex justify-between w-full items-center p-2 font-semibold text-sm">
          <p className="text-xs text-muted-foreground">EXPLORER</p>
          <div className="flex items-center gap-1">
            <CreateDialog
              projectName={projectName}
              btn={
                <Button size={"icon"} variant={"outline"}>
                  <PlusIcon size={20} />
                </Button>
              }
            />
          </div>
        </div>
        <div className="px-2 space-y-1">
          {data.map((item, index) => (
            <DirectoryItem key={index} item={item} level={0} currentPath="" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;

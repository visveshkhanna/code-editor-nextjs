"use client";
import { DirectoryItemType } from "@/lib/types";
import Link from "next/link";
import React, { useState } from "react";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";
import path from "path";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const hasChildren =
    item.type === "folder" && item.children && item.children.length > 0;

  const toggleExpand = () => {
    if (hasChildren) {
      setIsExpanded((prev) => !prev);
    }
  };

  // Compute the new path
  const itemPath = currentPath ? path.join(currentPath, item.name) : item.name;

  return (
    <>
      <div
        className={`flex items-center cursor-pointer h-8`}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={toggleExpand}
      >
        <span className="w-4 mr-2 flex-shrink-0">
          {item.type === "folder" ? (
            isExpanded ? (
              <FaFolderOpen />
            ) : (
              <FaFolder />
            )
          ) : (
            <FaFile />
          )}
        </span>
        {item.type === "file" ? (
          <Link href={`?fileName=${itemPath}`} className="text-sm select-none">
            {item.name}
          </Link>
        ) : (
          <span className="text-sm select-none">{item.name}</span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {item.children &&
            item.children.map((child, index) => (
              <DirectoryItem
                key={`${child.name}-${index}`}
                item={child}
                level={level + 1}
                currentPath={itemPath}
              />
            ))}
        </div>
      )}
    </>
  );
};

interface FileExplorerProps {
  data: DirectoryItemType[];
}

const FileExplorer: React.FC<FileExplorerProps> = ({ data }) => {
  return (
    <div>
      {data.map((item, index) => (
        <DirectoryItem
          key={`${item.name}-${index}`}
          item={item}
          level={0}
          currentPath=""
        />
      ))}
    </div>
  );
};

export default FileExplorer;

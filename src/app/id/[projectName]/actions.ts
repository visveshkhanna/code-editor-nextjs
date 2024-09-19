import { DirectoryItemType } from "@/lib/types";
import fs from "fs";
import path from "path";

const readDirectory = (dirPath: string): DirectoryItemType[] => {
  const items = fs.readdirSync(dirPath);
  return items.map((item: string): DirectoryItemType => {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      return {
        name: item,
        type: "folder",
        children: readDirectory(itemPath),
      };
    } else {
      return {
        name: item,
        type: "file",
      };
    }
  });
};

export const projectInfo = (projectName: string) => {
  const projectDir = path.join(
    process.cwd(),
    "projects",
    (projectName as string) || "Project1"
  );
  if (fs.existsSync(projectDir)) {
    const data = readDirectory(projectDir);
    return data;
  }
  return [];
};

import path from "path";
import fs from "fs";

export const readFile = (projectName: string, fileName: string): string => {
  const projectDir = path.join(
    process.cwd(),
    "projects",
    (projectName as string) || "Project1"
  );
  const filePath = path.join(projectDir, fileName);
  if (fs.existsSync(projectDir) && fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf8");
  }
  return "";
};

export const writeFile = (
  projectName: string,
  fileName: string,
  content: string
) => {
  const projectDir = path.join(
    process.cwd(),
    "projects",
    (projectName as string) || "Project1"
  );
  const filePath = path.join(projectDir, fileName);
  if (fs.existsSync(projectDir)) {
    fs.writeFileSync(filePath, content);
  }
};

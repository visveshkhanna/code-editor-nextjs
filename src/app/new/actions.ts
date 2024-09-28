import fs from "fs";
import path from "path";

export const createProject = async (formData: FormData) => {
  "use server";
  const projectName = formData.get("projectName");
  const project = formData.get("project");

  const projectDir = path.join(
    process.cwd(),
    "projects",
    (projectName as string) || "Project1"
  );

  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(projectDir, "echo.yml"),
    `name: ${projectName}
image: ${project}`
  );

  console.log(projectDir + " created.");
};

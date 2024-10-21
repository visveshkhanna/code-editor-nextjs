import path from "path";
import * as fs from "fs";

export async function POST(req: Request) {
  const { type, direct, projectName } = await req.json();

  const projectDir = path.join(
    process.cwd(),
    "projects",
    (projectName as string) || "Project1"
  );

  if (type === "Folder") {
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    fs.mkdirSync(path.join(projectDir, direct), { recursive: true });
  } else {
    fs.writeFileSync(path.join(projectDir, direct), "");
  }

  return Response.json({
    response: "ok",
  });
}

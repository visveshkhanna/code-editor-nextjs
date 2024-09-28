import { readFile } from "@/lib/files";

export async function POST(req: Request) {
  const body = await req.json();
  const { projectName, fileName } = body;

  if (!projectName || !fileName) {
    return Response.json({ error: "Missing projectName or fileName" });
  }
  const content = readFile(projectName, fileName);
  console.log(fileName, content);
  return Response.json({ content: content });
}

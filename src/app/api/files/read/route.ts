import { readFile } from "@/lib/files";

export async function POST(req: Request) {
  const body = await req.json();
  const { projectName, fileName } = body;

  if (!projectName || !fileName) {
    return Response.json({ error: "Missing projectName or fileName" });
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const content = readFile(projectName, fileName);
  return Response.json({ content: content });
}

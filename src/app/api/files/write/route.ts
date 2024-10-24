import { writeFile } from "@/lib/files";

export async function POST(req: Request) {
  const body = await req.json();
  const { projectName, fileName, content } = body;

  if (!projectName || !fileName || !content) {
    return Response.json({
      error: "Missing projectName or fileName or content",
    });
  }

  await writeFile(projectName, fileName, content);
  return Response.json({ success: true });
}

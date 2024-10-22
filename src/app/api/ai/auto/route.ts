import { openai } from "@/lib/openai";
import path from "path";
import * as fs from "fs";

const writeFile = (projectName: string, fileName: string, content: string) => {
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
export async function POST(req: Request) {
  const body = await req.json();
  const { projectName, fileName, content } = body;

  if (!projectName || !fileName || !content) {
    return Response.json({
      error: "Missing projectName or fileName or content",
    });
  }

  const response = await openai.chat.completions.create({
    model: "llama3.1",
    messages: [
      {
        role: "system",
        content:
          "You are a AI agent who collects the file name and the content inside it, if you could fix the errors automatically by getting the context yourselves without the need for other files, you can fix the code and return the same, if not you will return the content that the user sent simply. YOU WILL NOT ADD ANY TEXT APART FROM THAT. PROVIDE THE CODE IN TEXT FORMAT ONLY WITHOUT ANY MARKDOWN FORMAT",
      },
      {
        role: "user",
        content: `Filename: ${fileName}
        
        Content: ${content}`,
      },
    ],
  });

  writeFile(
    projectName,
    fileName,
    (response.choices[0].message.content || "").trim()
  );

  return Response.json({
    status: "ok",
  });
}

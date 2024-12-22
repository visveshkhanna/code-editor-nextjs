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
  const { projectName, fileName, content, prompt } = body;

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
        content: `You are an AI agent responsible for analyzing and correcting file content based on the provided filename and code content. If errors are identified and can be corrected based on the user’s prompt, modify the code accordingly and return only the corrected code. If no corrections are possible, return the original content exactly as provided.

        Return the output in plain text format only, containing the code content without any additional text, markdown formatting, or file information.
          
          PROMPT: ${prompt}
          `,
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

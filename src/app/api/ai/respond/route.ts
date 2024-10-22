import { openai } from "@/lib/openai";
import path from "path";

import * as fs from "fs";

const readFile = (projectName: string, fileName: string): string => {
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

const fileStructure = (projectName: string): string => {
  const projectDir = path.join(
    process.cwd(),
    "projects",
    projectName || "Project1"
  );

  const printTree = (dirPath: string, prefix: string = ""): string => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    let tree = "";

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const isLastEntry = i === entries.length - 1;
      const connector = isLastEntry ? "└── " : "├── ";

      tree += prefix + connector + entry.name + "\n";

      if (entry.isDirectory()) {
        const newPrefix = prefix + (isLastEntry ? "    " : "│   ");
        tree += printTree(path.join(dirPath, entry.name), newPrefix);
      }
    }
    return tree;
  };

  if (!fs.existsSync(projectDir)) {
    throw new Error(`Project directory ${projectDir} does not exist.`);
  }

  return printTree(projectDir);
};

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, projectName, fileName } = body;

  if (!messages || messages.length === 0) {
    return Response.json({
      error: "No messages provided",
    });
  }

  if (projectName && fileName) {
    const content = readFile(projectName, fileName);
    messages[messages.length - 1].content += `
    
    Current file: ${fileName}
    Content: ${content}`;
  }

  console.log(messages);

  const response = await openai.chat.completions.create({
    model: "llama3.1",
    messages: [
      {
        role: "system",
        content: `You are a coding assistant, who assists the user to write better code on the "ECHO AI Online Code Edtior', the user might be using any kind of programming language, or any project that he has.
        

        Project Name: ${projectName}
        
        Project Structure:
        ${fileStructure(projectName)}

        DO NOT PROVIDE VERY LONG RESPONSES, MAKE IT SHORT AND UNDERSTANDABLE.

        `,
      },
      ...messages,
    ],
  });

  messages.push({
    role: "assistant",
    content: response.choices[0].message.content,
  });

  return Response.json(messages);
}

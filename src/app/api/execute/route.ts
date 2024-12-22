import path from "path";
import { exec } from "child_process";

class CommandError extends Error {
  output: string;
  constructor(message: string, output: string) {
    super(message);
    this.name = "CommandError";
    this.output = output;
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { projectName, command } = body;

  const projectDir = path.join(
    process.cwd(),
    "projects",
    (projectName as string) || "Project1"
  );

  try {
    const output = await executeCommand(command, projectDir);
    console.log(output);
    return new Response(JSON.stringify({ type: "normal", output }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    if (e instanceof CommandError) {
      return new Response(JSON.stringify({ type: "error", output: e.output }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    } else {
      return new Response(
        JSON.stringify({ type: "error", error: "Error executing command" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  }
}

function executeCommand(command: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      command.replace("python", "/usr/sbin/python3"),
      { cwd, timeout: 10000 },
      (error, stdout, stderr) => {
        console.log(error, stdout, stderr);
        if (error) {
          const output = (stdout || "") + (stderr || "");
          if (error.killed) {
            reject(
              new CommandError("Process terminated due to timeout.", output)
            );
          } else {
            reject(new CommandError(stderr || error.message, output));
          }
        } else {
          resolve(stdout || stderr);
        }
      }
    );
  });
}

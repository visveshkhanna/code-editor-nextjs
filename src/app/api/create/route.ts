import docker from "@/lib/docker";
import path from "path";
import fs from "fs";
import tar from "tar-fs";

export async function POST(req: Request) {
  const body = await req.json();
  const { image, name, project } = body;

  const projectDir = path.join(
    process.cwd(),
    "projects",
    (project as string) || "Project1"
  );
  const projectDir2 = path.join(
    process.cwd(),
    "projects",
    ("Test2" as string) || "Project1"
  );

  // await docker.pull(image);

  // Container creation
  const container = await docker.createContainer({
    Image: image,
    WorkingDir: "/app",
    Cmd: ["sh", "-c", "echo 'CODE EDITOR CONTAINER' && exec sh"],
    AttachStdout: true,
    Tty: true,
    name: name,
  });

  await container.start();

  let isRunning = false;
  while (!isRunning) {
    const containerInfo = await container.inspect();
    isRunning = containerInfo.State.Running;
    if (!isRunning) {
      console.log("Waiting for container to start...");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  const logs = await container.logs({
    stdout: true,
    stderr: true,
    follow: false,
  });

  const tarStream = tar.pack(projectDir);
  const options = {
    path: "/app",
  };

  await container.putArchive(tarStream, options);

  return Response.json({
    containerId: container.id,
  });
}

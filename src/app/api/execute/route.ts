import docker from "@/lib/docker";

export async function POST(req: Request) {
  const body = await req.json();
  const { containerId, command } = body;

  try {
    const container = await docker.getContainer(containerId);
    await container.inspect();

    const containerData = await container.inspect();
    if (!containerData.State.Running) {
      return Response.json(
        { error: "Container is not running" },
        { status: 400 }
      );
    }

    const exec = await container.exec({
      Cmd: ["sh", "-c", command],
      AttachStdout: true,
      AttachStderr: true,
    });

    const execStream = await exec.start({});

    let execOutput = "";
    execStream.on("data", (chunk) => {
      execOutput += chunk.toString();
    });

    await new Promise((resolve) => execStream.on("end", resolve));

    // unicode encode

    return Response.json({
      execOutput: execOutput.replace(/[\u0000-\u001F\u007F-\u009F]/g, ""),
    });
  } catch (e) {
    return Response.json({ error: "Container not found" }, { status: 404 });
  }

  return Response.json({});
}

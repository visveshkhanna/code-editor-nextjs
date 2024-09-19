import { DirectoryItemType } from "@/lib/types";
import { projectInfo } from "./actions";
import FileExplorer from "./sidebar";
import CodeViewer from "./code-viewer";

export default function ProjectPage({
  params,
  searchParams,
}: {
  params: { projectName: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const projectDetails: DirectoryItemType[] = projectInfo(
    params.projectName
  ).reverse();

  return (
    <div className="flex flex-row w-full h-full">
      <pre className="flex flex-col min-w-[250px] border-r-2 h-screen p-2">
        {projectDetails && <FileExplorer data={projectDetails} />}
      </pre>
      <div className="flex flex-col w-full p-2 h-screen">
        <CodeViewer
          fileName={searchParams?.fileName as string}
          projectName={params.projectName}
        />
      </div>
    </div>
  );
}

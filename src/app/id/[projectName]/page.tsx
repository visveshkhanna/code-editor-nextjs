import { DirectoryItemType } from "@/lib/types";
import { projectInfo } from "./actions";
import FileExplorer from "./sidebar";
import CodeViewer from "./code-viewer";
import Terminal from "./terminal";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Folder } from "lucide-react";

export default function ProjectPage({
  params,
  searchParams,
}: {
  params: { projectName: string };
  searchParams?: { fileName: string };
}) {
  const projectDetails: DirectoryItemType[] = projectInfo(
    params.projectName
  ).reverse();

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={10} minSize={15} maxSize={25}>
        <div className="flex flex-col w-full border-r-2 h-dvh p-2">
          {projectDetails && (
            <FileExplorer
              data={projectDetails}
              projectName={params.projectName}
            />
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75} minSize={50}>
            {searchParams?.fileName ? (
              <CodeViewer
                fileName={(searchParams?.fileName as string) || ""}
                projectName={params.projectName}
              />
            ) : (
              <div className="flex flex-col gap-2 p-4 items-center justify-center w-full h-full text-muted-foreground bg-muted">
                <Folder size={30} />
                <p>No file selected</p>
              </div>
            )}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={30}>
            <Terminal projectName={params.projectName} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>

    // <div className="flex flex-row w-full h-full">
    //   <pre className="flex flex-col min-w-[250px] border-r-2 h-screen p-2">
    //     {projectDetails && <FileExplorer data={projectDetails} />}
    //   </pre>
    //   <div className="flex flex-col w-full p-2 h-screen">
    //     {searchParams?.fileName ? (
    //       <CodeViewer
    //         fileName={(searchParams?.fileName as string) || ""}
    //         projectName={params.projectName}
    //       />
    //     ) : (
    //       <div>No file selected</div>
    //     )}
    //     <Terminal />
    //   </div>
    // </div>
  );
}

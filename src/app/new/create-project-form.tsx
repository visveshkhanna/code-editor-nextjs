import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject } from "./actions";

const CreateProjectForm = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col w-full gap-3">
      <p className="text-lg font-semibold">Create {name} Project</p>
      <form
        action={createProject}
        className="flex flex-col gap-4 p-4 rounded-xl border w-full"
      >
        <Input type="text" name="projectName" placeholder="Project name" />
        <input type="hidden" name="project" value={name} />
        <Button>Create</Button>
      </form>
    </div>
  );
};

export default CreateProjectForm;

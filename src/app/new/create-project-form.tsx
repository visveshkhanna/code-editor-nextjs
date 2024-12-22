import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject } from "./actions";

const CreateProjectForm = () => {
  return (
    <div className="flex flex-col w-full gap-3">
      <p className="text-lg font-semibold">Create New Project</p>
      <form
        action={createProject}
        className="flex flex-col gap-4 rounded-xl w-full"
      >
        <Input type="text" name="projectName" placeholder="Project name" />

        <Button>Create</Button>
      </form>
    </div>
  );
};

export default CreateProjectForm;

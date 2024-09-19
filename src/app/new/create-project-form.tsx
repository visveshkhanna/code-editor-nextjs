import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject } from "./actions";

const CreateProjectForm = () => {
  return (
    <form
      action={createProject}
      className="flex flex-col gap-4 p-4 rounded-xl border w-fit m-4"
    >
      <Input type="text" name="projectName" placeholder="Project name" />
      <Button>Create</Button>
    </form>
  );
};

export default CreateProjectForm;

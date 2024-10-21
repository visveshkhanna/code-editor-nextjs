import CreateProjectForm from "./create-project-form";

export default function NewProject() {
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center gap-4">
      <p className="text-xl font-semibold">Create a new project</p>
      <div className="flex flex-row w-[500px] relative flex-wrap gap-2 border p-8 rounded-lg">
        <CreateProjectForm />
      </div>
    </div>
  );
}

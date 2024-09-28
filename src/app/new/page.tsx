import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import CreateProjectDialog from "./create-project-dialog";

interface ContainerCard {
  name: string;
  value: string;
  icon: React.ReactNode;
}

export default function NewProject() {
  const cards: ContainerCard[] = [
    {
      name: "Python 3",
      value: "python3",
      icon: <Icon icon="skill-icons:python-dark" className="size-12" />,
    },
    {
      name: "Node.js",
      value: "node",
      icon: <Icon icon="skill-icons:nodejs-dark" className="size-12" />,
    },
  ];
  return (
    <div className="w-full h-dvh flex flex-col justify-center items-center gap-4">
      <p className="text-xl font-semibold">Create a new project</p>
      <div className="flex flex-row w-[500px] relative flex-wrap gap-2 border p-8 rounded-lg">
        {cards.map((card) => {
          return (
            <CreateProjectDialog
              key={card.name}
              name={card.value}
              button={
                <Button
                  variant={"outline"}
                  key={card.name}
                  className="flex flex-col items-center gap-2 p-4 h-fit rounded-lg w-[100px]"
                >
                  {card.icon}
                  {card.name}
                </Button>
              }
            />
          );
        })}
      </div>
    </div>
  );
}

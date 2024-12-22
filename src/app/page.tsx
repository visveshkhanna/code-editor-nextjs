// import Image from "next/image";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-dvh w-full flex flex-col gap-4 justify-center items-center">
      <p className="text-2xl font-semibold">
        Welcome to ECHO AI Online Code Editor
      </p>
      <Link href={"/new"} className="text-xl font-semibold">
        <Button>Create New Project</Button>
      </Link>
    </div>
  );
}

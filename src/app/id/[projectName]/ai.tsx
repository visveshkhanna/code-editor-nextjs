import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
  role: string;
  message: string;
}

export default function AIChatBox() {
  return (
    <div className="flex flex-col w-full gap-2">
      <p className="text-sm text-muted-foreground">ECHO AI</p>
      <div className="flex-1 gap-2"></div>
      <Textarea rows={3} className="w-full" />
    </div>
  );
}

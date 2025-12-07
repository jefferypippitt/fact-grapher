import AIChat from "@/components/chatbot";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="pt-10">
        <AIChat />
      </div>
    </div>
  );
}

import { getUserTokens } from "@/actions/tokens";
import Chatbot from "@/components/chatbot";

export default async function Page() {
  const userTokens = await getUserTokens();

  // Always show chatbot - it will handle disabling input when tokens are 0

  return <Chatbot initialTokenCount={userTokens} />;
}

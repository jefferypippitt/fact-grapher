import { getUserTokens } from "@/actions/tokens";
import Chatbot from "@/components/chatbot";
import PricingCards from "@/components/pricing-cards";

export default async function Page() {
  const userTokens = await getUserTokens();

  // Protected gateway: Only show chatbot if user has tokens
  if (userTokens === 0) {
    return (
      <div className="container mx-auto min-h-[calc(100vh-8rem)] p-6">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-semibold text-2xl">Get Started</h1>
          <p className="text-muted-foreground">
            You need tokens to generate infographics
          </p>
        </div>
        <PricingCards />
      </div>
    );
  }

  return <Chatbot />;
}

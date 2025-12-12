import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserTokens } from "@/actions/tokens";
import Chatbot from "@/components/chatbot";
import PricingCards from "@/components/pricing-cards";
import { auth } from "@/lib/auth";

// Force dynamic rendering to ensure fresh token data after purchase
export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userTokens = await getUserTokens();

  // Protected gateway: Only show chatbot if user has tokens
  if (userTokens === 0) {
    return (
      <div className="container mx-auto min-h-[calc(100vh-8rem)] p-6">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-3xl">Get Started</h1>
          <p className="text-muted-foreground">
            You need tokens to use the chatbot. Choose a token pack that fits
            your needs.
          </p>
        </div>
        <PricingCards />
      </div>
    );
  }

  return <Chatbot />;
}

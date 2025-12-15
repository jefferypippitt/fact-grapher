import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { syncRecentPurchases } from "@/actions/tokens";
import { DashboardLink } from "@/components/dashboard-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mark this page as dynamic to ensure fresh data on each request
export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    checkout_id?: string;
    checkoutId?: string;
    customer_session_token?: string;
    [key: string]: string | undefined;
  }>;
}) {
  const params = await searchParams;
  // Polar redirects with customer_session_token, but we accept any param as success indicator
  const hasSuccessParam =
    params.checkout_id ||
    params.checkoutId ||
    params.customer_session_token ||
    Object.keys(params).length > 0;

  // If user navigates directly without any params, redirect to dashboard
  if (!hasSuccessParam) {
    redirect("/dashboard");
  }

  // Try to sync any recent purchases as a fallback if webhook didn't fire
  try {
    await syncRecentPurchases();
  } catch (error) {
    // Log error but don't fail the page - webhook might handle it later
    console.error("Error syncing purchases on success page:", error);
  }

  return (
    <div className="flex h-full items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed successfully! Your tokens are being
            added to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground text-sm">
            <p>Thank you for your purchase!</p>
            <p className="mt-2">
              Your tokens are being processed and will be available in your
              account shortly. You can start using the chatbot once they appear.
            </p>
          </div>
          <div className="pt-4">
            <DashboardLink />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

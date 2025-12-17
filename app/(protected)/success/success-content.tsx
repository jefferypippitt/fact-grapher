import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { AutoSyncPurchases } from "@/components/auto-sync-purchases";
import { DashboardLink } from "@/components/dashboard-link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function SuccessContent({
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
  const hasSuccessParam =
    params.checkout_id ||
    params.checkoutId ||
    params.customer_session_token ||
    Object.keys(params).length > 0;

  if (!hasSuccessParam) {
    redirect("/dashboard");
  }

  return (
    <>
      <AutoSyncPurchases />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your tokens are being added to your account and will be available
            shortly.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <DashboardLink />
        </CardFooter>
      </Card>
    </>
  );
}

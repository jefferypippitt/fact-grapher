import { Suspense } from "react";
import { SuccessContent } from "./success-content";
import { SuccessSkeleton } from "./success-skeleton";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    checkout_id?: string;
    checkoutId?: string;
    customer_session_token?: string;
    [key: string]: string | undefined;
  }>;
}) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <Suspense fallback={<SuccessSkeleton />}>
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

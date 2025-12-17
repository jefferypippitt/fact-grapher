import { Suspense } from "react";
import { getUserSession } from "@/actions/users";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't await - pass promise to client component
  const sessionPromise = getUserSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<Header />}>
        <Header sessionPromise={sessionPromise} />
      </Suspense>
      <main className="container mx-auto max-w-4xl flex-1 px-4 py-4 md:py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

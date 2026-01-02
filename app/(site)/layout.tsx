import { Suspense } from "react";
import { getUserSession } from "@/actions/users";
import Footer from "@/components/footer";
import Header from "@/components/header";

async function SessionHeader() {
  const session = await getUserSession();
  return <Header session={session} />;
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<Header />}>
        <SessionHeader />
      </Suspense>
      <main className="container mx-auto max-w-4xl flex-1 px-4 py-4 md:py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

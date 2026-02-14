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
    <div>
      <Suspense fallback={<Header />}>
        <SessionHeader />
      </Suspense>
      <main>{children}</main>
      <Footer />
    </div>
  );
}

import type { Metadata } from "next";
import SignInForm from "@/components/auth/sign-in";

export const metadata: Metadata = {
  title: "Sign In | Fact Grapher",
  description: "Sign in to your Fact Grapher account.",
  alternates: {
    canonical: "/sign-in",
  },
};

export default function SignInPage() {
  return (
    <section className="container flex min-h-[calc(100vh-200px)] items-center justify-center py-8">
      <SignInForm />
    </section>
  );
}

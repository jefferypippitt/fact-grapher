import type { Metadata } from "next";
import SignUpForm from "@/components/auth/sign-up";

export const metadata: Metadata = {
  title: "Sign Up | Fact Grapher",
  description: "Create a Fact Grapher account.",
  alternates: {
    canonical: "/sign-up",
  },
};

export default function SignUpPage() {
  return (
    <section className="container flex min-h-[calc(100vh-200px)] items-center justify-center py-8">
      <SignUpForm />
    </section>
  );
}

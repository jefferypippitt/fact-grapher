import SignInForm from "@/components/auth/sign-in";

export default function SignInPage() {
  return (
    <section className="container flex min-h-[calc(100vh-200px)] items-center justify-center py-8">
      <SignInForm />
    </section>
  );
}

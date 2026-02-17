import PricingCards from "@/components/pricing-cards";

export default function PricingPage() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] px-6 py-10">
      <div className="mb-10 text-center">
        <h1 className="mb-3 font-bold text-3xl tracking-tight sm:text-4xl">
          Choose Your Token Pack
        </h1>
        <p className="mx-auto max-w-md font-light">
          Purchase with a single click
        </p>
      </div>
      <PricingCards />
    </div>
  );
}

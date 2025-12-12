import PricingCards from "@/components/pricing-cards";

export default function PricingPage() {
  return (
    <div className="container mx-auto min-h-[calc(100vh-8rem)] p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-3xl">Choose Your Token Pack</h1>
        <p className="text-muted-foreground">Purchase with a single click</p>
      </div>
      <PricingCards />
    </div>
  );
}

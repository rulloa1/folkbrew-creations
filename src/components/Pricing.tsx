import PricingCard from "./PricingCard";

const Pricing = () => {
  const pricingPlans = [
    {
      title: "Foundation Package",
      subtitle: "Your digital presence, perfected",
      price: "$2,500",
      period: "ONE-TIME",
      features: [
        "Premium Website Design",
        "Fully Responsive",
        "SEO Setup",
        "SSL Certificate",
        "Contact Forms",
        "Analytics Integration",
        "30 Days Support",
      ],
      ctaText: "GET STARTED",
    },
    {
      title: "Growth Engine",
      subtitle: "Complete automation & lead gen",
      price: "$997",
      period: "/MONTH",
      setupFee: "+ $2,500 SETUP FEE (INCLUDES FOUNDATION)",
      features: [
        "Everything in Foundation",
        "AI Lead Generation",
        "Automated Campaigns",
        "CRM Integration",
        "AI Chatbot",
        "Advanced Analytics",
        "Social Media Automation",
        "Priority Support",
        "Monthly Consultation",
      ],
      featured: true,
      ctaText: "START TRANSFORMATION",
    },
  ];

  return (
    <section id="pricing" className="relative py-32 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-4xl">
        {/* Section header */}
        <div className="text-center mb-4 animate-slide-up">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl italic text-foreground tracking-wide">
            INVESTMENT TIERS
          </h2>
        </div>
        
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground text-center mb-16">
          TRANSPARENT PRICING // NO HIDDEN FEES
        </p>

        {/* Pricing cards grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <PricingCard {...plan} />
            </div>
          ))}
        </div>

        {/* Guarantee text */}
        <p className="text-center font-mono text-xs text-muted-foreground mt-12">
          30-DAY SATISFACTION GUARANTEE. CANCEL ANYTIME WITH 30 DAYS NOTICE.
        </p>
      </div>
    </section>
  );
};

export default Pricing;

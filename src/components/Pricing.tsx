import { LayoutGrid, Zap, ArrowUp } from "lucide-react";

const Pricing = () => {
  const foundationFeatures = [
    "Premium Website Design",
    "Fully Responsive",
    "SEO Setup",
    "SSL Certificate",
    "Contact Forms",
    "Analytics Integration",
    "30 Days Support",
  ];

  const growthFeatures = [
    "Everything in Foundation",
    "AI Lead Generation",
    "Automated Campaigns",
    "CRM Integration",
    "AI Chatbot",
    "Advanced Analytics",
    "Social Media Automation",
    "Priority Support",
    "Monthly Consultation",
  ];

  return (
    <section id="pricing" className="relative px-6 py-20 border-t border-foreground/30">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl gothic-text text-foreground mb-4 glitch-effect tracking-widest drop-shadow-[0_0_15px_hsl(0_0%_100%/0.4)]" 
            data-text="INVESTMENT TIERS"
          >
            INVESTMENT TIERS
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-foreground/80 to-transparent mx-auto shadow-[0_0_10px_hsl(0_0%_100%/0.6)]" />
          <p className="text-primary/80 mt-4 draincore-font">TRANSPARENT PRICING // NO HIDDEN FEES</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Foundation Package */}
          <div className="relative group floating-animation">
            <div className="brutalist-border p-8 bg-card/70 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-foreground/10 to-transparent" />
              
              {/* Chrome Pipe - Horizontal */}
              <div className="chrome-pipe w-full h-20 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/40 to-transparent animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <LayoutGrid className="w-8 h-8 text-foreground drop-shadow-[0_0_20px_hsl(0_0%_100%)]" />
                </div>
              </div>
              
              <h3 className="text-3xl gothic-text text-foreground mb-2">Foundation Package</h3>
              <p className="text-primary/70 mb-6 draincore-font">YOUR DIGITAL PRESENCE, PERFECTED</p>
              
              <div className="mb-8">
                <span className="text-5xl gothic-text text-foreground">$2,500</span>
                <span className="text-primary/60 ml-2 draincore-font">ONE-TIME</span>
              </div>

              <ul className="space-y-3 mb-8">
                {foundationFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 brutalist-border bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <ArrowUp className="w-3 h-3 text-foreground/80" />
                    </div>
                    <span className="text-primary/70 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full brutalist-border bg-foreground/10 hover:bg-foreground/20 text-foreground py-4 draincore-font transition-all duration-300 hover:shadow-[0_0_20px_hsl(0_0%_100%/0.5)]">
                GET STARTED
              </button>
              
              <div className="absolute bottom-2 left-2 drain-blade w-8 h-1 rotate-45" style={{ animationDelay: '1.1s' }} />
            </div>
          </div>

          {/* Growth Engine Package */}
          <div className="relative group floating-animation">
            {/* Best Value Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
              <span className="bg-foreground text-background draincore-font px-5 py-2 shadow-[0_0_20px_hsl(0_0%_100%)]">
                BEST VALUE
              </span>
            </div>

            <div className="brutalist-border p-8 bg-card/70 backdrop-blur-sm relative overflow-hidden border-foreground/60">
              <div className="absolute inset-0 bg-gradient-to-tl from-foreground/15 to-transparent" />
              
              {/* Chrome Pipe - Vertical */}
              <div className="chrome-pipe w-20 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foreground/50 to-transparent animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Zap className="w-10 h-10 text-foreground drop-shadow-[0_0_25px_hsl(0_0%_100%)]" />
                </div>
              </div>
              
              <h3 className="text-3xl gothic-text text-foreground mb-2">Growth Engine</h3>
              <p className="text-primary/70 mb-6 draincore-font">COMPLETE AUTOMATION & LEAD GEN</p>
              
              <div className="mb-2">
                <span className="text-5xl gothic-text text-foreground">$997</span>
                <span className="text-primary/60 ml-2 draincore-font">/MONTH</span>
              </div>
              <p className="text-primary/60 mb-8 draincore-font text-sm">
                + $2,500 SETUP FEE <span className="text-foreground">(INCLUDES FOUNDATION)</span>
              </p>

              <ul className="space-y-3 mb-8">
                {growthFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 brutalist-border bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <ArrowUp className="w-3 h-3 text-foreground/80" />
                    </div>
                    <span className="text-primary/70 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full brutalist-border bg-foreground text-background hover:bg-foreground/90 py-4 draincore-font transition-all duration-300 shadow-[0_0_20px_hsl(0_0%_100%/0.8)] hover:shadow-[0_0_30px_hsl(0_0%_100%)]">
                START TRANSFORMATION
              </button>
              
              <div className="absolute left-2 top-1/3 drain-crystal w-6 h-4 -translate-y-1/2" style={{ animationDelay: '1.8s' }} />
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <p className="text-center text-primary/70 mt-12 draincore-font">
          <span className="text-foreground">30-DAY SATISFACTION GUARANTEE.</span> CANCEL ANYTIME WITH 30 DAYS NOTICE.
        </p>
      </div>
    </section>
  );
};

export default Pricing;

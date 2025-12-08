import { LayoutGrid, Zap, Brain } from "lucide-react";
import ServiceCard from "./ServiceCard";

const Services = () => {
  const services = [
    {
      icon: LayoutGrid,
      title: "Web Development",
      description: "Premium, conversion-optimized websites designed to establish your digital presence and drive results.",
      features: [
        "Custom Website Design",
        "Mobile-First Responsive",
        "SEO Optimization",
        "Performance Tuning",
      ],
    },
    {
      icon: Zap,
      title: "AI Automation",
      description: "Intelligent automation systems that handle repetitive tasks, freeing your team to focus on growth.",
      features: [
        "Workflow Automation",
        "Email & SMS Sequences",
        "CRM Integration",
        "Smart Scheduling",
      ],
      featured: true,
    },
    {
      icon: Brain,
      title: "Lead Generation",
      description: "AI-powered lead capture and nurturing systems that work around the clock to grow your pipeline.",
      features: [
        "Smart Chatbots",
        "Lead Scoring",
        "Multi-Channel Outreach",
        "Analytics Dashboard",
      ],
    },
  ];

  return (
    <section id="services" className="relative px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl gothic-text text-foreground mb-4 glitch-effect tracking-widest drop-shadow-[0_0_15px_hsl(0_0%_100%/0.4)]" 
            data-text="ENTERPRISE SOLUTIONS"
          >
            ENTERPRISE SOLUTIONS
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-foreground/80 to-transparent mx-auto shadow-[0_0_10px_hsl(0_0%_100%/0.6)]" />
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>
      </div>

      {/* Background lightning effects */}
      <div className="absolute top-1/4 left-1/3 w-px h-40 bg-gradient-to-b from-foreground/80 via-foreground/40 to-transparent animate-pulse shadow-[0_0_8px_hsl(0_0%_100%/0.6)]" />
      <div className="absolute top-1/2 right-1/4 w-px h-32 bg-gradient-to-b from-foreground/60 via-foreground/20 to-transparent animate-pulse shadow-[0_0_6px_hsl(0_0%_100%/0.5)]" style={{ animationDelay: '1s' }} />
    </section>
  );
};

export default Services;

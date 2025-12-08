import { LayoutGrid, Zap, Target } from "lucide-react";
import ServiceCard from "./ServiceCard";

const Services = () => {
  const services = [
    {
      icon: <LayoutGrid className="w-6 h-6 text-foreground" />,
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
      icon: <Zap className="w-6 h-6 text-foreground" />,
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
      icon: <Target className="w-6 h-6 text-foreground" />,
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
    <section id="services" className="relative py-32 px-6">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="drain-crystal w-10 h-14 floating-animation" style={{ top: '10%', left: '5%' }} />
        <div className="drain-blade w-20 h-5" style={{ bottom: '15%', right: '8%' }} />
        <div className="glow-star" style={{ top: '20%', right: '10%' }} />
        <div className="drain-cross w-5 h-5" style={{ bottom: '20%', left: '8%' }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 
            className="draincore-font text-3xl sm:text-4xl md:text-5xl text-foreground tracking-[0.15em] uppercase glitch-effect"
            data-text="ENTERPRISE SOLUTIONS"
          >
            ENTERPRISE SOLUTIONS
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="chrome-pipe w-24 h-0.5" />
          </div>
        </div>

        {/* Service cards grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

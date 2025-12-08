import { LayoutGrid, Zap, Target, Sparkles } from "lucide-react";
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
        <div className="absolute top-20 left-[5%]">
          <Sparkles className="w-4 h-4 text-muted-foreground/20 animate-pulse-slow" />
        </div>
        <div className="absolute bottom-20 right-[8%]">
          <Sparkles className="w-3 h-3 text-muted-foreground/25 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl italic text-foreground tracking-wide">
            ENTERPRISE SOLUTIONS
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="w-16 h-px bg-muted-foreground/30" />
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

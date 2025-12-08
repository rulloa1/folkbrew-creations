import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  featured?: boolean;
}

const ServiceCard = ({ icon, title, description, features, featured }: ServiceCardProps) => {
  return (
    <div className="relative group">
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="brutalist-border bg-secondary px-4 py-1 text-xs font-mono tracking-[0.15em] text-foreground uppercase">
            FEATURED
          </span>
        </div>
      )}
      
      <div className="glass-card h-full p-8 flex flex-col transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_hsl(0_0%_100%/0.1)]">
        {/* Angular decoration */}
        <div className="absolute top-3 right-3 drain-sharp-star w-4 h-4" />

        {/* Icon container */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 brutalist-border bg-secondary/80 flex items-center justify-center">
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="draincore-font text-lg text-foreground mb-4 tracking-[0.1em] uppercase text-center">
          {title}
        </h3>

        {/* Description */}
        <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-6 text-center">
          {description}
        </p>

        {/* Features list */}
        <ul className="space-y-3 mt-auto">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-muted-foreground">
              <span className="w-1.5 h-1.5 bg-primary rotate-45" />
              <span className="font-mono text-xs uppercase tracking-wide">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceCard;

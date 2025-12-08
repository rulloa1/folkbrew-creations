import { Sparkles } from "lucide-react";
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
          <span className="bg-secondary border border-border px-4 py-1 text-xs font-mono tracking-wider text-muted-foreground">
            FEATURED
          </span>
        </div>
      )}
      
      <div className="glass-card h-full p-8 flex flex-col transition-transform duration-500 group-hover:-translate-y-1">
        {/* Star decoration */}
        <div className="absolute top-4 right-4">
          <Sparkles className="w-3 h-3 text-muted-foreground/40" />
        </div>

        {/* Icon container */}
        <div className="mb-6 flex justify-center">
          <div className="w-28 h-16 rounded-full bg-secondary/80 border border-border/50 flex items-center justify-center">
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl italic text-foreground mb-4">
          {title}
        </h3>

        {/* Description */}
        <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-6">
          {description}
        </p>

        {/* Features list */}
        <ul className="space-y-3 mt-auto">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-muted-foreground">
              <Sparkles className="w-3 h-3 flex-shrink-0" />
              <span className="font-mono text-xs">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceCard;

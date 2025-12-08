import { ArrowUp, LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
  priceLabel: string;
  features: string[];
  featured?: boolean;
  index: number;
}

const ServiceCard = ({ icon: Icon, title, description, price, priceLabel, features, featured, index }: ServiceCardProps) => {
  return (
    <div className={`relative group floating-animation ${featured ? 'md:-mt-4' : ''}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <span className="bg-foreground text-background draincore-font px-4 py-1 shadow-[0_0_15px_hsl(0_0%_100%/0.8)]">
            FEATURED
          </span>
        </div>
      )}
      
      <div className="brutalist-border p-8 bg-card/70 backdrop-blur-sm relative overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent" />
        
        {/* Chrome Pipe with icon */}
        <div className="chrome-pipe w-full h-32 mb-6 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/40 to-transparent animate-pulse" />
          <Icon className="w-12 h-12 text-foreground z-10 drop-shadow-[0_0_20px_hsl(0_0%_100%)]" />
        </div>
        
        <h3 className="text-2xl gothic-text text-foreground mb-2">{title}</h3>
        
        {/* Pricing */}
        <div className="mb-4">
          <span className="text-3xl gothic-text text-foreground">{price}</span>
          <span className="text-primary/60 ml-2 draincore-font text-xs">{priceLabel}</span>
        </div>
        
        <p className="text-primary/80 mb-6 draincore-font text-sm">{description}</p>
        
        <ul className="space-y-3 mb-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <ArrowUp className="w-4 h-4 text-foreground/80 flex-shrink-0" />
              <span className="text-primary/70 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* Reflection effect */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-foreground/15 to-transparent" />
        
        {/* Sharp drain pattern overlay */}
        <div className="absolute top-2 right-2 drain-sharp-star scale-75" style={{ animationDelay: `${index * 0.3}s` }} />
      </div>
    </div>
  );
};

export default ServiceCard;

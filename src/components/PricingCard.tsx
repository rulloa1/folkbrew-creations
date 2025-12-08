import { Check } from "lucide-react";
import { Button } from "./ui/button";

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  setupFee?: string;
  features: string[];
  featured?: boolean;
  ctaText: string;
}

const PricingCard = ({
  title,
  subtitle,
  price,
  period,
  setupFee,
  features,
  featured,
  ctaText,
}: PricingCardProps) => {
  return (
    <div className="relative group">
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-primary text-primary-foreground px-4 py-1 text-xs font-mono tracking-[0.15em] uppercase">
            BEST VALUE
          </span>
        </div>
      )}

      <div className={`glass-card h-full p-8 flex flex-col transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_0_30px_hsl(0_0%_100%/0.1)] ${featured ? 'ring-1 ring-primary/40' : ''}`}>
        {/* Angular decoration */}
        <div className="absolute top-3 right-3 drain-sharp-star w-4 h-4" />
        
        {/* Title */}
        <h3 className="draincore-font text-xl text-foreground mb-2 tracking-[0.1em] uppercase">
          {title}
        </h3>
        <p className="font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase mb-8">
          {subtitle}
        </p>

        {/* Price */}
        <div className="mb-2">
          <span className="draincore-font text-4xl text-foreground">{price}</span>
          <span className="font-mono text-xs text-muted-foreground ml-2 uppercase">{period}</span>
        </div>

        {setupFee && (
          <p className="font-mono text-xs text-muted-foreground mb-6 uppercase">
            {setupFee}
          </p>
        )}

        {!setupFee && <div className="mb-6" />}

        {/* Divider */}
        <div className="chrome-pipe w-full h-px mb-6" />

        {/* Features */}
        <ul className="space-y-4 mb-8 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wide">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          className={`w-full font-mono text-xs tracking-[0.15em] uppercase brutalist-border rounded-none ${
            featured 
              ? 'bg-foreground text-background hover:bg-foreground/90' 
              : 'bg-transparent border-primary text-foreground hover:bg-secondary'
          }`}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;

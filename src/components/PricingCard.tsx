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
          <span className="bg-accent text-accent-foreground px-4 py-1 text-xs font-mono tracking-wider font-medium">
            BEST VALUE
          </span>
        </div>
      )}

      <div className={`glass-card h-full p-8 flex flex-col transition-all duration-500 group-hover:-translate-y-1 ${featured ? 'ring-1 ring-accent/30' : ''}`}>
        {/* Title */}
        <h3 className="font-display text-2xl text-foreground mb-2">
          {title}
        </h3>
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-8">
          {subtitle}
        </p>

        {/* Price */}
        <div className="mb-2">
          <span className="font-display text-4xl text-foreground">{price}</span>
          <span className="font-mono text-xs text-muted-foreground ml-1">{period}</span>
        </div>

        {setupFee && (
          <p className="font-mono text-xs text-muted-foreground mb-6">
            {setupFee}
          </p>
        )}

        {!setupFee && <div className="mb-6" />}

        {/* Features */}
        <ul className="space-y-4 mb-8 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <span className="font-mono text-xs text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          variant={featured ? "default" : "outline"}
          className={`w-full font-mono text-xs tracking-wider ${
            featured 
              ? 'bg-foreground text-background hover:bg-foreground/90' 
              : 'border-border hover:bg-secondary'
          }`}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;

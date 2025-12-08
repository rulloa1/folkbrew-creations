import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-[10%] animate-pulse-slow">
          <Sparkles className="w-4 h-4 text-muted-foreground/30" />
        </div>
        <div className="absolute top-1/3 right-[15%] animate-pulse-slow" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-3 h-3 text-muted-foreground/20" />
        </div>
        <div className="absolute bottom-1/3 left-[20%] animate-pulse-slow" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-3 h-3 text-muted-foreground/25" />
        </div>
        <div className="absolute top-1/2 right-[10%] animate-pulse-slow" style={{ animationDelay: '0.5s' }}>
          <Sparkles className="w-4 h-4 text-muted-foreground/30" />
        </div>
        
        {/* Vertical line decoration */}
        <div className="absolute left-[15%] top-24 w-px h-32 bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent" />
      </div>

      {/* Main title */}
      <div className="text-center animate-fade-in">
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider text-foreground mb-8">
          ROYAL AI SOLUTIONS
        </h1>
        
        <p className="font-mono text-xs sm:text-sm tracking-[0.3em] text-muted-foreground">
          AUTOMATION // LEAD GENERATION // ENTERPRISE SOLUTIONS
        </p>

        {/* Decorative line under subtitle */}
        <div className="mt-12 flex justify-center">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-muted-foreground/50 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden lightning-bg digital-noise">
      {/* Drain pattern decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Stars */}
        <div className="drain-sharp-star floating-animation" style={{ top: '15%', left: '8%' }} />
        <div className="drain-sharp-star floating-animation" style={{ top: '25%', right: '12%', animationDelay: '-2s' }} />
        <div className="drain-sharp-star floating-animation" style={{ bottom: '30%', left: '15%', animationDelay: '-4s' }} />
        
        {/* Crystals */}
        <div className="drain-crystal floating-animation w-8 h-12" style={{ top: '40%', right: '8%', animationDelay: '-1s' }} />
        <div className="drain-crystal floating-animation w-6 h-9" style={{ bottom: '25%', right: '20%', animationDelay: '-3s' }} />
        
        {/* Blades */}
        <div className="drain-blade w-16 h-4" style={{ top: '20%', left: '25%' }} />
        <div className="drain-blade w-12 h-3" style={{ bottom: '35%', right: '25%' }} />
        
        {/* Crosses */}
        <div className="drain-cross w-6 h-6" style={{ top: '60%', left: '5%' }} />
        <div className="drain-cross w-5 h-5" style={{ top: '30%', right: '5%' }} />

        {/* Glow stars */}
        <div className="glow-star" style={{ top: '18%', right: '30%' }} />
        <div className="glow-star" style={{ bottom: '40%', left: '30%' }} />
        
        {/* Chrome vertical line */}
        <div className="absolute left-[12%] top-24 w-px h-40 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
        <div className="absolute right-[12%] bottom-24 w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Main title */}
      <div className="text-center animate-fade-in relative z-10">
        <h1 
          className="draincore-font text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em] text-foreground mb-8 glitch-effect"
          data-text="ROYAL AI SOLUTIONS"
        >
          ROYAL AI SOLUTIONS
        </h1>
        
        <p className="font-mono text-xs sm:text-sm tracking-[0.3em] text-muted-foreground uppercase">
          AUTOMATION // LEAD GENERATION // ENTERPRISE SOLUTIONS
        </p>

        {/* Chrome pipe decoration */}
        <div className="mt-12 flex justify-center">
          <div className="chrome-pipe w-32 h-1" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

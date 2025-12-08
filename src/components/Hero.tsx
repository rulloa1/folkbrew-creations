const Hero = () => {
  return (
    <section className="relative px-6 py-16 drip-effect min-h-[80vh] flex items-center justify-center">
      <div className="max-w-6xl mx-auto text-center">
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl gothic-text text-foreground mb-8 glitch-effect tracking-wider drop-shadow-[0_0_20px_hsl(0_0%_100%/0.3)]" 
          data-text="RoyAISolutions"
        >
          RoyAISolutions
        </h1>
        <p className="text-lg md:text-xl draincore-font text-primary/90 max-w-2xl mx-auto whitespace-nowrap">
          AUTOMATION // LEAD GENERATION // ENTERPRISE SOLUTIONS
        </p>
      </div>
      
      {/* Hero decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-foreground/80 transform rotate-45 floating-animation shadow-[0_0_15px_hsl(0_0%_100%/0.8)]" />
      <div className="absolute top-1/2 left-[16%] w-0.5 h-20 bg-gradient-to-b from-foreground/80 to-transparent floating-animation shadow-[0_0_8px_hsl(0_0%_100%/0.7)]" />
    </section>
  );
};

export default Hero;

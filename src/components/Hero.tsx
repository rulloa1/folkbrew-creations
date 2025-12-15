import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative px-6 py-20 md:py-32 drip-effect min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated background lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-foreground/20 to-transparent animate-pulse" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-foreground/15 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-foreground/10 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Subtitle */}
        <p className="draincore-font text-primary/60 text-sm tracking-[0.3em] mb-6 animate-fade-in">
          AI-POWERED BUSINESS SOLUTIONS
        </p>

        {/* Main Title */}
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl gothic-text text-foreground mb-6 glitch-effect tracking-wider drop-shadow-[0_0_30px_hsl(0_0%_100%/0.4)] animate-fade-in" 
          data-text="RoyAISolutions"
          style={{ animationDelay: '0.1s' }}
        >
          RoyAISolutions
        </h1>

        {/* Tagline */}
        <p 
          className="text-lg md:text-xl draincore-font text-primary/80 max-w-2xl mx-auto mb-4 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          AUTOMATION // LEAD GENERATION // ENTERPRISE SOLUTIONS
        </p>

        {/* Description */}
        <p 
          className="text-sm md:text-base text-primary/60 max-w-xl mx-auto mb-10 draincore-font leading-relaxed animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          Transform your business with cutting-edge AI automation. 
          We build systems that generate leads while you sleep.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <button
            onClick={scrollToContact}
            className="brutalist-border bg-foreground text-background hover:bg-foreground/90 px-8 py-4 draincore-font transition-all duration-300 shadow-[0_0_25px_hsl(0_0%_100%/0.6)] hover:shadow-[0_0_40px_hsl(0_0%_100%)] hover:scale-105"
          >
            GET STARTED
          </button>
          <button
            onClick={() => navigate('/testimonials')}
            className="brutalist-border bg-foreground/10 hover:bg-foreground/20 text-foreground px-8 py-4 draincore-font transition-all duration-300 hover:shadow-[0_0_20px_hsl(0_0%_100%/0.3)]"
          >
            VIEW REVIEWS
          </button>
        </div>
      </div>
      
      {/* Hero decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-foreground/80 transform rotate-45 floating-animation shadow-[0_0_15px_hsl(0_0%_100%/0.8)]" />
      <div className="absolute top-1/2 left-[16%] w-0.5 h-20 bg-gradient-to-b from-foreground/80 to-transparent floating-animation shadow-[0_0_8px_hsl(0_0%_100%/0.7)]" />
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-foreground/60 transform rotate-45 floating-animation shadow-[0_0_12px_hsl(0_0%_100%/0.6)]" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/3 right-[18%] w-0.5 h-16 bg-gradient-to-b from-foreground/60 to-transparent floating-animation shadow-[0_0_6px_hsl(0_0%_100%/0.5)]" style={{ animationDelay: '1s' }} />
      
      {/* Chrome accents */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent" />
    </section>
  );
};

export default Hero;
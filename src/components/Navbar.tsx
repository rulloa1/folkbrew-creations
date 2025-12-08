const Navbar = () => {
  return (
    <header className="relative z-10 p-6 brutalist-border border-b border-primary/40 bg-card/50 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <div 
          className="gothic-text text-2xl text-foreground glitch-effect" 
          data-text="ROYAL AI"
        >
          ROYAL AI
        </div>
        <div className="hidden md:flex space-x-8 draincore-font">
          <a 
            href="#services" 
            className="text-primary hover:text-foreground transition-colors duration-300 hover:drop-shadow-[0_0_10px_hsl(0_0%_100%/0.8)]"
          >
            SERVICES
          </a>
          <a 
            href="#pricing" 
            className="text-primary hover:text-foreground transition-colors duration-300 hover:drop-shadow-[0_0_10px_hsl(0_0%_100%/0.8)]"
          >
            PRICING
          </a>
          <a 
            href="#contact" 
            className="text-primary hover:text-foreground transition-colors duration-300 hover:drop-shadow-[0_0_10px_hsl(0_0%_100%/0.8)]"
          >
            CONTACT
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

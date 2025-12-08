const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-display text-xl italic text-foreground tracking-wide">
          ROYAL AI
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="#services" 
            className="font-mono text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
          >
            SERVICES
          </a>
          <a 
            href="#pricing" 
            className="font-mono text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
          >
            PRICING
          </a>
          <a 
            href="#contact" 
            className="font-mono text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
          >
            CONTACT
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

const Navbar = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { id: 'services', label: 'SERVICES' },
    { id: 'pricing', label: 'PRICING' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleAdminClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = '/admin';
  };

  return (
    <header className="relative z-10 p-6 brutalist-border border-b border-primary/40 bg-card/50 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="gothic-text text-2xl text-foreground glitch-effect cursor-pointer" 
          data-text="RoyAISolutions"
        >
          RoyAISolutions
        </a>
        <div className="hidden md:flex space-x-8 draincore-font items-center">
          {navLinks.map((link) => (
            <a 
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => scrollToSection(e, link.id)}
              className="text-primary hover:text-foreground transition-colors duration-300 hover:drop-shadow-[0_0_10px_hsl(0_0%_100%/0.8)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/admin"
            onClick={handleAdminClick}
            className="brutalist-border bg-foreground/10 hover:bg-foreground/20 text-foreground px-4 py-1.5 text-sm transition-all"
          >
            ADMIN
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

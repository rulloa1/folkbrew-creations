import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate to home first then scroll
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const navLinks = [
    { id: 'services', label: 'SERVICES' },
    { id: 'pricing', label: 'PRICING' },
    { id: 'proposals', label: 'GET PROPOSAL', href: '/proposals' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    e.preventDefault();
    if (link.href) {
      navigate(link.href);
    } else {
      scrollToSection(link.id);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="relative z-10 p-6 brutalist-border border-b border-primary/40 bg-card/50 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <a 
          href="/"
          onClick={handleLogoClick}
          className="gothic-text text-2xl text-foreground glitch-effect cursor-pointer" 
          data-text="RoyAISolutions"
        >
          RoyAISolutions
        </a>
        <div className="hidden md:flex space-x-8 draincore-font items-center">
          {navLinks.map((link) => (
            <a 
              key={link.id}
              href={link.href || `#${link.id}`}
              onClick={(e) => handleNavClick(e, link)}
              className="text-primary hover:text-foreground transition-colors duration-300 hover:drop-shadow-[0_0_10px_hsl(0_0%_100%/0.8)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin');
            }}
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
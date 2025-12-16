import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
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
    { id: 'testimonials', label: 'REVIEWS', href: '/testimonials' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    e.preventDefault();
    setIsOpen(false);
    if (link.href) {
      navigate(link.href);
    } else {
      scrollToSection(link.id);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="relative z-50 p-6 brutalist-border border-b border-primary/40 bg-card/50 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <a 
          href="/"
          onClick={handleLogoClick}
          className="gothic-text text-2xl text-foreground glitch-effect cursor-pointer" 
          data-text="RoyAISolutions"
        >
          RoyAISolutions
        </a>

        {/* Desktop Navigation */}
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

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden brutalist-border bg-foreground/10 hover:bg-foreground/20 text-foreground p-2 transition-all"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md border-b border-primary/40 z-50">
          <div className="flex flex-col p-6 space-y-4 draincore-font">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href || `#${link.id}`}
                onClick={(e) => handleNavClick(e, link)}
                className="text-primary hover:text-foreground transition-colors duration-300 py-2 border-b border-primary/20"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                navigate('/admin');
              }}
              className="brutalist-border bg-foreground/10 hover:bg-foreground/20 text-foreground px-4 py-3 text-center transition-all"
            >
              ADMIN
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
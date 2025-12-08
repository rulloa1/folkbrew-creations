const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-6 relative">
      {/* Subtle decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="drain-sharp-star w-3 h-3" />
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="draincore-font text-lg text-foreground tracking-[0.2em] uppercase">
            ROYAL AI
          </p>
          <p className="font-mono text-xs text-muted-foreground tracking-[0.1em] uppercase">
            © {new Date().getFullYear()} Royal AI Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

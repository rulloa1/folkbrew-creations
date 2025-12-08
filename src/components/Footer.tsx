const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-lg italic text-foreground">
            ROYAL AI
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Royal AI Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

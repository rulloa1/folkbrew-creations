const Footer = () => {
  return (
    <footer className="relative px-6 py-8 border-t border-foreground/40 bg-card/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto text-center">
        <div className="draincore-font text-foreground/80 tracking-widest drop-shadow-[0_0_8px_hsl(0_0%_100%/0.3)]">
          RoyAISolutions © {new Date().getFullYear()} // AUTOMATION_COMPLETE
        </div>
      </div>
    </footer>
  );
};

export default Footer;

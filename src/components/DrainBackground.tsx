const DrainBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Glowing stars */}
      <div className="glow-star" style={{ top: '15%', left: '10%', animationDelay: '0s' }} />
      <div className="glow-star" style={{ top: '25%', right: '15%', animationDelay: '1s' }} />
      <div className="glow-star" style={{ bottom: '30%', left: '20%', animationDelay: '2s' }} />
      
      {/* Sharp angular stars */}
      <div className="drain-sharp-star" style={{ top: '30%', right: '25%', animationDelay: '0.5s' }} />
      <div className="drain-sharp-star" style={{ bottom: '40%', left: '15%', animationDelay: '2.5s' }} />
      <div className="drain-sharp-star" style={{ top: '60%', right: '10%', animationDelay: '4s' }} />
      
      {/* Angular blades */}
      <div className="drain-blade w-16 h-3 rotate-[25deg]" style={{ top: '25%', left: '70%', animationDelay: '1s' }} />
      <div className="drain-blade w-12 h-2 -rotate-45" style={{ bottom: '55%', right: '35%', animationDelay: '3s' }} />
      <div className="drain-blade w-20 h-4 rotate-12" style={{ top: '45%', left: '5%', animationDelay: '5s' }} />
      
      {/* Zigzag lightning drains */}
      <div className="drain-zigzag w-8 h-16 rotate-[15deg]" style={{ top: '40%', right: '20%', animationDelay: '1.5s' }} />
      <div className="drain-zigzag w-6 h-12 -rotate-[30deg]" style={{ bottom: '35%', left: '30%', animationDelay: '3.5s' }} />
      
      {/* Sharp spikes */}
      <div className="drain-spike w-6 h-8 rotate-45" style={{ top: '20%', left: '60%', animationDelay: '0.8s' }} />
      <div className="drain-spike w-4 h-6 -rotate-[60deg]" style={{ bottom: '25%', right: '15%', animationDelay: '2.8s' }} />
      <div className="drain-spike w-5 h-7 rotate-[30deg]" style={{ top: '70%', left: '80%', animationDelay: '4.2s' }} />
      
      {/* Crystal shards */}
      <div className="drain-crystal w-10 h-8 rotate-[20deg]" style={{ top: '35%', left: '25%', animationDelay: '1.2s' }} />
      <div className="drain-crystal w-8 h-6 -rotate-[15deg]" style={{ bottom: '45%', right: '40%', animationDelay: '3.2s' }} />
      
      {/* Cutting lines */}
      <div className="drain-cut-line w-24 rotate-[25deg]" style={{ top: '50%', left: '15%', animationDelay: '0.3s' }} />
      <div className="drain-cut-line w-32 -rotate-[40deg]" style={{ top: '65%', right: '25%', animationDelay: '2.3s' }} />
      <div className="drain-cut-line w-20 rotate-[60deg]" style={{ bottom: '20%', left: '50%', animationDelay: '4.3s' }} />
      
      {/* Angular crosses */}
      <div className="drain-cross w-6 h-6 rotate-45" style={{ top: '55%', right: '30%', animationDelay: '1.8s' }} />
      <div className="drain-cross w-5 h-5 -rotate-[30deg]" style={{ bottom: '60%', left: '40%', animationDelay: '3.8s' }} />
      
      {/* Drain grid pattern */}
      <div className="drain-grid w-16 h-16 opacity-30" style={{ top: '75%', right: '5%', animationDelay: '0s' }} />
      <div className="drain-grid w-12 h-12 opacity-20" style={{ bottom: '15%', left: '75%', animationDelay: '3s' }} />
      
      {/* Angular drain elements */}
      <div className="drain-angular w-14 h-2 rotate-[60deg]" style={{ top: '80%', left: '20%', animationDelay: '1s' }} />
      <div className="drain-angular w-10 h-2 -rotate-[30deg]" style={{ top: '15%', right: '45%', animationDelay: '2.5s' }} />
      
      {/* Vertical circuit flows */}
      <div className="drain-circuit w-px h-20" style={{ top: '25%', left: '85%', animationDelay: '1.2s' }} />
      <div className="drain-circuit w-px h-24" style={{ bottom: '30%', left: '8%', animationDelay: '3.5s' }} />
      
      {/* Lightning bolt accents */}
      <div className="lightning-bolt scale-50" style={{ top: '10%', right: '5%', animationDelay: '0.8s' }} />
      <div className="lightning-bolt scale-[0.4]" style={{ bottom: '10%', left: '85%', animationDelay: '2.2s' }} />
      
      {/* Subtle flowing lines */}
      <div className="absolute w-28 h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent animate-pulse" style={{ top: '85%', left: '5%' }} />
      <div className="absolute w-20 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent animate-pulse" style={{ top: '10%', right: '30%', animationDelay: '1.5s' }} />
    </div>
  );
};

export default DrainBackground;

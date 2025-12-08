import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import DrainBackground from "@/components/DrainBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background lightning-bg digital-noise relative">
      {/* Fixed drain pattern background */}
      <DrainBackground />
      
      <Navbar />
      <Hero />
      <Services />
      <Pricing />
      <Contact />
      <Footer />

      {/* Ambient effects layer */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[5]">
        <div className="drain-cut-line w-8 absolute top-1/4 left-[16%] animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="drain-cut-line w-6 absolute top-3/4 right-[20%] animate-pulse" style={{ animationDelay: '0.8s' }} />
        <div className="drain-cut-line w-10 absolute top-1/2 left-3/4 animate-pulse rotate-90" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
};

export default Index;

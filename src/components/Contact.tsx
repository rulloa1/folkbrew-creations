import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "MESSAGE SENT",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "contact@royalsolutions.me",
      decoration: "drain-spike",
      decorationStyle: { top: '0.5rem', right: '0.5rem' },
      decorationClass: "w-3 h-4 rotate-[30deg]",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 000-0000",
      decoration: "drain-cross",
      decorationStyle: { bottom: '0.5rem', left: '0.5rem' },
      decorationClass: "w-4 h-4",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Remote // Worldwide",
      decoration: "drain-sharp-star",
      decorationStyle: { top: '0.5rem', left: '0.5rem' },
      decorationClass: "scale-50",
    },
  ];

  return (
    <section id="contact" className="relative px-6 py-20 border-t border-foreground/30">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl gothic-text text-foreground mb-4 glitch-effect tracking-widest drop-shadow-[0_0_15px_hsl(0_0%_100%/0.4)]" 
            data-text="INITIATE CONTACT"
          >
            INITIATE CONTACT
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-foreground/80 to-transparent mx-auto shadow-[0_0_10px_hsl(0_0%_100%/0.6)]" />
        </div>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <div 
              key={index} 
              className="brutalist-border p-6 bg-card/70 backdrop-blur-sm relative overflow-hidden text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent" />
              <info.icon className="w-8 h-8 text-foreground mx-auto mb-4 drop-shadow-[0_0_15px_hsl(0_0%_100%/0.8)]" />
              <h3 className="gothic-text text-foreground mb-2">{info.label}</h3>
              <p className="text-primary/70 draincore-font text-sm break-all">{info.value}</p>
              <div 
                className={`absolute ${info.decoration} ${info.decorationClass}`} 
                style={{ ...info.decorationStyle, animationDelay: `${0.5 + index * 0.7}s` }} 
              />
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="brutalist-border p-8 bg-card/70 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="draincore-font text-primary/80 mb-2 block text-sm">NAME</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full brutalist-border bg-card/50 text-foreground px-4 py-3 draincore-font focus:outline-none focus:shadow-[0_0_15px_hsl(0_0%_100%/0.3)] transition-all placeholder:text-muted-foreground"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="draincore-font text-primary/80 mb-2 block text-sm">EMAIL</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full brutalist-border bg-card/50 text-foreground px-4 py-3 draincore-font focus:outline-none focus:shadow-[0_0_15px_hsl(0_0%_100%/0.3)] transition-all placeholder:text-muted-foreground"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="draincore-font text-primary/80 mb-2 block text-sm">MESSAGE</label>
              <textarea 
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full brutalist-border bg-card/50 text-foreground px-4 py-3 draincore-font focus:outline-none focus:shadow-[0_0_15px_hsl(0_0%_100%/0.3)] transition-all resize-none placeholder:text-muted-foreground"
                placeholder="Tell us about your project..."
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full brutalist-border bg-foreground text-background hover:bg-foreground/90 py-4 draincore-font transition-all duration-300 shadow-[0_0_20px_hsl(0_0%_100%/0.8)] hover:shadow-[0_0_30px_hsl(0_0%_100%)]"
            >
              SEND MESSAGE
            </button>
          </form>

          <div className="absolute bottom-4 right-4 drain-zigzag w-6 h-8" style={{ animationDelay: '2.3s' }} />
        </div>
      </div>
    </section>
  );
};

export default Contact;

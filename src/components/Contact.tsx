import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
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
      icon: <Mail className="w-4 h-4" />,
      label: "Email",
      value: "contact@royalsolutions.me",
    },
    {
      icon: <Phone className="w-4 h-4" />,
      label: "Phone",
      value: "+1 (555) 000-0000",
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "Location",
      value: "Remote // Worldwide",
    },
  ];

  return (
    <section id="contact" className="relative py-32 px-6">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="drain-sharp-star floating-animation" style={{ top: '15%', right: '10%' }} />
        <div className="drain-blade w-16 h-4" style={{ bottom: '20%', left: '5%' }} />
        <div className="glow-star" style={{ top: '40%', left: '8%' }} />
        <div className="drain-crystal w-6 h-9 floating-animation" style={{ bottom: '30%', right: '8%', animationDelay: '-2s' }} />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 
            className="draincore-font text-3xl sm:text-4xl md:text-5xl text-foreground tracking-[0.15em] uppercase glitch-effect"
            data-text="INITIATE CONTACT"
          >
            INITIATE CONTACT
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="chrome-pipe w-24 h-0.5" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact info */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {contactInfo.map((info, index) => (
              <div key={index} className="glass-card p-6 group hover:shadow-[0_0_20px_hsl(0_0%_100%/0.08)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 brutalist-border bg-secondary/50 flex items-center justify-center">
                    <span className="text-primary">{info.icon}</span>
                  </div>
                  <h3 className="draincore-font text-base text-foreground tracking-[0.1em] uppercase">{info.label}</h3>
                </div>
                <p className="font-mono text-sm text-muted-foreground uppercase tracking-wide ml-11">{info.value}</p>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <form 
            onSubmit={handleSubmit} 
            className="glass-card p-8 space-y-6 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div>
              <label className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase block mb-2">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-secondary border-border font-mono text-sm rounded-none brutalist-border uppercase tracking-wide"
                placeholder="YOUR NAME"
                required
              />
            </div>

            <div>
              <label className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase block mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-secondary border-border font-mono text-sm rounded-none brutalist-border"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="font-mono text-xs tracking-[0.15em] text-muted-foreground uppercase block mb-2">
                Message
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-secondary border-border font-mono text-sm min-h-[120px] resize-none rounded-none brutalist-border"
                placeholder="Tell us about your project..."
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-mono text-xs tracking-[0.15em] uppercase rounded-none brutalist-border"
            >
              SEND MESSAGE
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

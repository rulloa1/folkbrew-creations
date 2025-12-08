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
      title: "Message Sent",
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
      <div className="container mx-auto max-w-5xl">
        {/* Section header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl italic text-foreground tracking-wide">
            INITIATE CONTACT
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact info */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {contactInfo.map((info, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-muted-foreground">{info.icon}</span>
                  <h3 className="font-display text-lg text-foreground">{info.label}</h3>
                </div>
                <p className="font-mono text-sm text-muted-foreground">{info.value}</p>
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
              <label className="font-mono text-xs tracking-wider text-muted-foreground uppercase block mb-2">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-secondary border-border font-mono text-sm"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="font-mono text-xs tracking-wider text-muted-foreground uppercase block mb-2">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-secondary border-border font-mono text-sm"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="font-mono text-xs tracking-wider text-muted-foreground uppercase block mb-2">
                Message
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-secondary border-border font-mono text-sm min-h-[120px] resize-none"
                placeholder="Tell us about your project..."
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-mono text-xs tracking-wider"
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

import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(1, "Phone is required").max(20, "Phone must be less than 20 characters"),
  company: z.string().trim().min(1, "Company is required").max(100, "Company must be less than 100 characters"),
  budget: z.string().trim().min(1, "Budget is required").max(50, "Budget must be less than 50 characters"),
  needs: z.string().trim().min(1, "Please tell us about your needs").max(1000, "Message must be less than 1000 characters"),
});

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    budget: "",
    needs: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "VALIDATION ERROR",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-lead', {
        body: {
          firstName: validation.data.firstName,
          lastName: validation.data.lastName,
          email: validation.data.email,
          phone: validation.data.phone,
          company: validation.data.company,
          budget: validation.data.budget,
          needs: validation.data.needs,
        },
      });

      if (error) throw error;
      
      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "MESSAGE SENT",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ firstName: "", lastName: "", email: "", phone: "", company: "", budget: "", needs: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message. Please try again.";
      if (import.meta.env.DEV) {
        console.error('Error submitting lead:', error);
      }
      toast({
        title: "ERROR",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "roryulloa@gmail.com",
      decoration: "drain-spike",
      decorationStyle: { top: '0.5rem', right: '0.5rem' },
      decorationClass: "w-3 h-4 rotate-[30deg]",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "(346) 298-5038",
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

  const inputClass = "w-full brutalist-border bg-card/50 text-foreground px-4 py-3 draincore-font focus:outline-none focus:shadow-[0_0_15px_hsl(0_0%_100%/0.3)] transition-all placeholder:text-muted-foreground";

  return (
    <section id="contact" className="relative px-6 py-20 border-t border-foreground/30">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl gothic-text text-foreground mb-4 glitch-effect tracking-widest drop-shadow-[0_0_15px_hsl(0_0%_100%/0.4)]" 
            data-text="HOW CAN WE HELP?"
          >
            HOW CAN WE HELP?
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
            {/* Row 1: First Name, Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="draincore-font text-primary/80 mb-2 block text-sm">FIRST NAME *</label>
                <input 
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={inputClass}
                  placeholder="John"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="draincore-font text-primary/80 mb-2 block text-sm">LAST NAME *</label>
                <input 
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={inputClass}
                  placeholder="Doe"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Row 2: Email, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="draincore-font text-primary/80 mb-2 block text-sm">EMAIL *</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  placeholder="john@company.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="draincore-font text-primary/80 mb-2 block text-sm">PHONE *</label>
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass}
                  placeholder="(555) 123-4567"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Row 3: Company, Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="draincore-font text-primary/80 mb-2 block text-sm">COMPANY *</label>
                <input 
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={inputClass}
                  placeholder="Your company name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="draincore-font text-primary/80 mb-2 block text-sm">YOUR BUDGET *</label>
                <input 
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className={inputClass}
                  placeholder="$5,000 - $10,000"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Row 4: Needs */}
            <div>
              <label className="draincore-font text-primary/80 mb-2 block text-sm">TELL ME ABOUT YOUR NEEDS *</label>
              <textarea 
                rows={6}
                value={formData.needs}
                onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                className={`${inputClass} resize-none`}
                placeholder="Describe your project, goals, and any specific requirements..."
                required
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full brutalist-border bg-foreground text-background hover:bg-foreground/90 py-4 draincore-font transition-all duration-300 shadow-[0_0_20px_hsl(0_0%_100%/0.8)] hover:shadow-[0_0_30px_hsl(0_0%_100%)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "SENDING..." : "SUBMIT"}
            </button>
          </form>

          <div className="absolute bottom-4 right-4 drain-zigzag w-6 h-8" style={{ animationDelay: '2.3s' }} />
        </div>
      </div>
    </section>
  );
};

export default Contact;

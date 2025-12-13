import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Mail, Phone, Building, DollarSign, Calendar, Trash2, User } from 'lucide-react';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  budget: string;
  needs: string;
  created_at: string;
}

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchLeads();
    }
  }, [user, isAdmin]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'ERROR',
        description: 'Failed to load leads',
        variant: 'destructive',
      });
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      
      setLeads(leads.filter(lead => lead.id !== id));
      toast({
        title: 'SUCCESS',
        description: 'Lead deleted',
      });
    } catch (error) {
      toast({
        title: 'ERROR',
        description: 'Failed to delete lead',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="draincore-font text-primary animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background lightning-bg digital-noise flex items-center justify-center p-6">
        <div className="brutalist-border p-8 bg-card/70 backdrop-blur-sm text-center max-w-md">
          <h1 className="gothic-text text-2xl text-foreground mb-4 glitch-effect" data-text="ACCESS DENIED">
            ACCESS DENIED
          </h1>
          <p className="draincore-font text-primary/70 mb-6">
            You don't have admin privileges. Contact an administrator to request access.
          </p>
          <button
            onClick={handleSignOut}
            className="brutalist-border bg-foreground/10 hover:bg-foreground/20 text-foreground px-6 py-2 draincore-font transition-all"
          >
            SIGN OUT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background lightning-bg digital-noise">
      {/* Header */}
      <header className="brutalist-border border-b border-primary/40 bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="gothic-text text-xl text-foreground glitch-effect" data-text="RoyAISolutions">
              RoyAISolutions
            </a>
            <span className="draincore-font text-primary/50 text-sm">// ADMIN PANEL</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="draincore-font text-primary/70 text-sm hidden md:block">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="brutalist-border bg-foreground/10 hover:bg-foreground/20 text-foreground px-4 py-2 draincore-font transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">SIGN OUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 
            className="text-3xl md:text-4xl gothic-text text-foreground mb-2 glitch-effect tracking-widest" 
            data-text="LEADS DASHBOARD"
          >
            LEADS DASHBOARD
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-foreground/80 to-transparent" />
        </div>

        {loadingLeads ? (
          <div className="text-center py-12">
            <div className="draincore-font text-primary animate-pulse">LOADING LEADS...</div>
          </div>
        ) : leads.length === 0 ? (
          <div className="brutalist-border p-12 bg-card/70 backdrop-blur-sm text-center">
            <p className="draincore-font text-primary/70">No leads yet. They will appear here when submitted.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="brutalist-border p-6 bg-card/70 backdrop-blur-sm relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent" />
                
                <div className="relative z-10">
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-foreground" />
                      <h3 className="gothic-text text-lg text-foreground">
                        {lead.first_name} {lead.last_name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity brutalist-border bg-destructive/20 hover:bg-destructive/40 text-destructive p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-primary/80">
                      <Mail className="w-4 h-4" />
                      <span className="draincore-font text-sm truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary/80">
                      <Phone className="w-4 h-4" />
                      <span className="draincore-font text-sm">{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary/80">
                      <Building className="w-4 h-4" />
                      <span className="draincore-font text-sm">{lead.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary/80">
                      <DollarSign className="w-4 h-4" />
                      <span className="draincore-font text-sm">{lead.budget}</span>
                    </div>
                  </div>

                  {/* Needs Section */}
                  <div className="mb-3">
                    <p className="draincore-font text-primary/70 text-sm leading-relaxed">
                      {lead.needs}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-primary/50">
                    <Calendar className="w-3 h-3" />
                    <span className="draincore-font text-xs">
                      {new Date(lead.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <span className="draincore-font text-primary/50 text-sm">
            Total: {leads.length} lead{leads.length !== 1 ? 's' : ''}
          </span>
        </div>
      </main>
    </div>
  );
};

export default Admin;

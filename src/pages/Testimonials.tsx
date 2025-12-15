import { useState, useEffect } from 'react';
import { Star, LogIn, Send, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import DrainBackground from '@/components/DrainBackground';

interface Testimonial {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  rating: number;
  content: string;
  created_at: string;
}

const Testimonials = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!content.trim()) {
      toast({
        title: 'ERROR',
        description: 'Please write a review',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('testimonials').insert({
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        user_avatar: user.user_metadata?.avatar_url || null,
        rating,
        content: content.trim(),
      });

      if (error) throw error;

      toast({
        title: 'SUCCESS',
        description: 'Your review has been posted!',
      });

      setContent('');
      setRating(5);
      fetchTestimonials();
    } catch (error) {
      toast({
        title: 'ERROR',
        description: 'Failed to post review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return;

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;

      setTestimonials(testimonials.filter((t) => t.id !== id));
      toast({
        title: 'SUCCESS',
        description: 'Review deleted',
      });
    } catch (error) {
      toast({
        title: 'ERROR',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 transition-all duration-200 ${
              star <= (interactive ? hoveredStar || rating : count)
                ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_hsl(45_100%_50%/0.8)]'
                : 'text-primary/30'
            } ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
          />
        ))}
      </div>
    );
  };

  const averageRating = testimonials.length
    ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-background lightning-bg digital-noise relative">
      <DrainBackground />

      {/* Header */}
      <header className="relative z-10 p-6 brutalist-border border-b border-primary/40 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary hover:text-foreground transition-colors draincore-font"
          >
            <ArrowLeft className="w-5 h-5" />
            BACK
          </button>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="gothic-text text-2xl text-foreground glitch-effect cursor-pointer"
            data-text="RoyAISolutions"
          >
            RoyAISolutions
          </a>
          <div className="w-20" />
        </div>
      </header>

      <main className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl gothic-text text-foreground mb-4 glitch-effect tracking-widest drop-shadow-[0_0_15px_hsl(0_0%_100%/0.4)]"
            data-text="TESTIMONIALS"
          >
            TESTIMONIALS
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-foreground/80 to-transparent mx-auto shadow-[0_0_10px_hsl(0_0%_100%/0.6)]" />

          {/* Average Rating */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-4xl gothic-text text-foreground">{averageRating}</span>
            {renderStars(Math.round(parseFloat(averageRating)))}
            <span className="text-primary/70 draincore-font">
              ({testimonials.length} review{testimonials.length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>

        {/* Write Review Section */}
        <div className="brutalist-border p-6 bg-card/70 backdrop-blur-sm relative overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent" />

          {!user ? (
            <div className="relative z-10 text-center py-8">
              <p className="draincore-font text-primary/80 mb-6">
                Sign in with Google to leave a review
              </p>
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="brutalist-border bg-foreground text-background hover:bg-foreground/90 px-8 py-3 draincore-font transition-all duration-300 shadow-[0_0_20px_hsl(0_0%_100%/0.5)] hover:shadow-[0_0_30px_hsl(0_0%_100%)] flex items-center gap-3 mx-auto"
              >
                <LogIn className="w-5 h-5" />
                SIGN IN WITH GOOGLE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full border-2 border-foreground/50"
                  />
                )}
                <div>
                  <p className="gothic-text text-foreground">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="draincore-font text-primary/50 text-sm">Posting as</p>
                </div>
              </div>

              <div>
                <label className="draincore-font text-primary/80 mb-2 block text-sm">
                  YOUR RATING
                </label>
                {renderStars(rating, true)}
              </div>

              <div>
                <label className="draincore-font text-primary/80 mb-2 block text-sm">
                  YOUR REVIEW
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full brutalist-border bg-card/50 text-foreground px-4 py-3 draincore-font focus:outline-none focus:shadow-[0_0_15px_hsl(0_0%_100%/0.3)] transition-all placeholder:text-muted-foreground resize-none"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="brutalist-border bg-foreground text-background hover:bg-foreground/90 px-8 py-3 draincore-font transition-all duration-300 shadow-[0_0_20px_hsl(0_0%_100%/0.5)] hover:shadow-[0_0_30px_hsl(0_0%_100%)] flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'POSTING...' : 'POST REVIEW'}
              </button>
            </form>
          )}
        </div>

        {/* Testimonials List */}
        {loadingTestimonials ? (
          <div className="text-center py-12">
            <div className="draincore-font text-primary animate-pulse">LOADING REVIEWS...</div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="brutalist-border p-12 bg-card/70 backdrop-blur-sm text-center">
            <p className="draincore-font text-primary/70">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="brutalist-border p-6 bg-card/70 backdrop-blur-sm relative overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {testimonial.user_avatar ? (
                        <img
                          src={testimonial.user_avatar}
                          alt={testimonial.user_name}
                          className="w-10 h-10 rounded-full border border-foreground/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-foreground/20 flex items-center justify-center">
                          <span className="gothic-text text-foreground">
                            {testimonial.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="gothic-text text-foreground">{testimonial.user_name}</p>
                        <p className="draincore-font text-primary/50 text-xs">
                          {new Date(testimonial.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {renderStars(testimonial.rating)}
                      {user?.id === testimonial.user_id && (
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-destructive/20 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="draincore-font text-primary/80 leading-relaxed">
                    {testimonial.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Testimonials;
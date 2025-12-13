import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: 'VALIDATION ERROR',
        description: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        let message = error.message;
        if (error.message.includes('Invalid login credentials')) {
          message = 'Invalid email or password';
        } else if (error.message.includes('User already registered')) {
          message = 'An account with this email already exists';
        }
        toast({
          title: 'ERROR',
          description: message,
          variant: 'destructive',
        });
        return;
      }

      if (!isLogin) {
        toast({
          title: 'SUCCESS',
          description: 'Account created! You can now sign in.',
        });
        setIsLogin(true);
      }
    } catch (error) {
      toast({
        title: 'ERROR',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="draincore-font text-primary animate-pulse">LOADING...</div>
      </div>
    );
  }

  const inputClass = "w-full brutalist-border bg-card/50 text-foreground px-4 py-3 draincore-font focus:outline-none focus:shadow-[0_0_15px_hsl(0_0%_100%/0.3)] transition-all placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background lightning-bg digital-noise flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 
            className="text-3xl md:text-4xl gothic-text text-foreground mb-2 glitch-effect tracking-widest" 
            data-text={isLogin ? 'ADMIN LOGIN' : 'CREATE ACCOUNT'}
          >
            {isLogin ? 'ADMIN LOGIN' : 'CREATE ACCOUNT'}
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-foreground/80 to-transparent mx-auto" />
        </div>

        <div className="brutalist-border p-8 bg-card/70 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="draincore-font text-primary/80 mb-2 block text-sm">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="draincore-font text-primary/80 mb-2 block text-sm">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full brutalist-border bg-foreground text-background hover:bg-foreground/90 py-3 draincore-font transition-all duration-300 shadow-[0_0_20px_hsl(0_0%_100%/0.8)] hover:shadow-[0_0_30px_hsl(0_0%_100%)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 text-center relative z-10">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="draincore-font text-primary/70 hover:text-foreground transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-4 text-center relative z-10">
            <a
              href="/"
              className="draincore-font text-primary/50 hover:text-foreground transition-colors text-xs"
            >
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

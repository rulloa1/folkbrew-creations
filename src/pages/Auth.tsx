import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, user, loading } = useAuth();
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

          <div className="relative z-10 mt-6">
            <div className="flex items-center gap-4 my-4">
              <Separator className="flex-1 bg-foreground/20" />
              <span className="draincore-font text-primary/50 text-xs">OR</span>
              <Separator className="flex-1 bg-foreground/20" />
            </div>
            
            <button
              type="button"
              onClick={async () => {
                const { error } = await signInWithGoogle();
                if (error) {
                  toast({
                    title: 'ERROR',
                    description: error.message,
                    variant: 'destructive',
                  });
                }
              }}
              disabled={isLoading}
              className="w-full brutalist-border bg-card/50 text-foreground hover:bg-card py-3 draincore-font transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              CONTINUE WITH GOOGLE
            </button>
          </div>

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

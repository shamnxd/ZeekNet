import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-6">
        {}
        <div className="relative">
          <div className="text-[135px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary leading-none select-none opacity-20 dark:opacity-40">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-card rounded-full shadow-xl flex items-center justify-center animate-bounce border border-border">
              <Search className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
            </div>
          </div>
        </div>

        {}
        <div className="space-y-3 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Oops! Page Not Found
          </h1>
          <p className="text-base text-muted-foreground max-w-sm mx-auto">
            The page you're looking for seems to have taken a different career path. 
            Let's get you back on track!
          </p>
        </div>

        {}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="default"
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            size="default"
            className="w-full sm:w-auto gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {}
        <div className="pt-6 border-t border-border mx-4">
          <p className="text-xs text-muted-foreground mb-3">You might be looking for:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/jobs')}
              className="text-xs text-primary hover:text-primary/80 hover:underline font-medium"
            >
              Browse Jobs
            </button>
            <span className="text-muted-foreground/30">•</span>
            <button
              onClick={() => navigate('/auth/login')}
              className="text-xs text-primary hover:text-primary/80 hover:underline font-medium"
            >
              Login
            </button>
            <span className="text-muted-foreground/30">•</span>
            <button
              onClick={() => navigate('/auth/register')}
              className="text-xs text-primary hover:text-primary/80 hover:underline font-medium"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
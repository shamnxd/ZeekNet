import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[180px] md:text-[240px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl flex items-center justify-center animate-bounce">
              <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you're looking for seems to have taken a different career path. 
            Let's get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-200 mx-4">
          <p className="text-sm text-gray-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/jobs')}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Browse Jobs
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate('/auth/login')}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Login
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate('/auth/register')}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
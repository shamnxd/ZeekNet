import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { WebRTCVideoCall } from '@/components/video/WebRTCVideoCall';
import { useAppSelector } from '@/hooks/useRedux';
import { Loader2 } from 'lucide-react';

const VideoCall = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    if (!token) {
      navigate('/auth/login');
      return;
    }

    
    
    setIsAuthorized(true);
    setIsLoading(false);
  }, [token, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-white">Loading video call...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized || !roomId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this video call.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <WebRTCVideoCall
      roomId={roomId}

      onEndCall={() => navigate(-1)}
    />
  );
};

export default VideoCall;





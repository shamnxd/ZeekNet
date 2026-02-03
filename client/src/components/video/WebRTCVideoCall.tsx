import { useEffect, useRef, useState } from 'react';
import { Video, VideoOff, Mic, MicOff, Monitor, PhoneOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { webrtcService } from '@/services/webrtc.service';
import type { WebRTCCallbacks } from '@/services/webrtc.service';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
import { UserRole } from '@/constants/enums';

interface WebRTCVideoCallProps {
  roomId: string;
  isInitiator?: boolean;
  onEndCall?: () => void;
}

export const WebRTCVideoCall = ({ roomId, onEndCall }: Omit<WebRTCVideoCallProps, 'isInitiator'>) => {
  const navigate = useNavigate();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { name, companyName, role } = useAppSelector((state) => state.auth);
  const localDisplayName = role === UserRole.COMPANY ? (companyName || name) : name;
  const screenShareStreamRef = useRef<MediaStream | null>(null);
  const [remoteUserId, setRemoteUserId] = useState<string | null>(null);
  const [remoteUserName, setRemoteUserName] = useState<string | null>(null);
  const [isRemoteVideoEnabled, setIsRemoteVideoEnabled] = useState(true);
  const [isRemoteAudioEnabled, setIsRemoteAudioEnabled] = useState(true);

  useEffect(() => {
    const callbacks: WebRTCCallbacks = {
      onRemoteStream: (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      },
      onConnectionStateChange: (state) => {
        setConnectionState(state);
        if (state === 'connected') {
          setIsConnecting(false);
        } else if (state === 'failed' || state === 'disconnected') {
          setError('Connection lost');
        }
      },
      onError: (err) => {
        setError(err.message);
        setIsConnecting(false);
      },
      onUserJoined: (userId, userName) => {
        setRemoteUserId(userId);
        if (userName) setRemoteUserName(userName);
      },
      onUserLeft: () => {
        setRemoteUserId(null);
        setRemoteUserName(null);
        setIsRemoteVideoEnabled(true);
        setIsRemoteAudioEnabled(true);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        setConnectionState('disconnected');
      },
      onMediaToggle: ({ type, enabled }) => {
        if (type === 'video') {
          setIsRemoteVideoEnabled(enabled);
        } else if (type === 'audio') {
          setIsRemoteAudioEnabled(enabled);
        }
      }
    };

    const initializeCall = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        console.log('Initializing call with name:', localDisplayName);
        await webrtcService.initialize(roomId, callbacks, localDisplayName || undefined);
        const localStream = webrtcService.getLocalStream();

        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      } catch (err) {
        console.error('Error initializing call:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize call');
        setIsConnecting(false);
      }
    };

    initializeCall();

    return () => {
      webrtcService.disconnect();
    };
  }, [roomId, localDisplayName]);

  useEffect(() => {
    if (isVideoEnabled && localVideoRef.current) {
      localVideoRef.current.play().catch(e => console.log('Local video play catch:', e.message));
    }
  }, [isVideoEnabled]);

  useEffect(() => {
    if (isRemoteVideoEnabled && remoteVideoRef.current) {
      remoteVideoRef.current.play().catch(e => console.log('Remote video play catch:', e.message));
    }
  }, [isRemoteVideoEnabled, connectionState]);

  const handleToggleVideo = async () => {
    const enabled = await webrtcService.toggleVideo();
    setIsVideoEnabled(enabled);
    if (enabled && localVideoRef.current) {
      localVideoRef.current.play().catch(console.error);
    }
  };

  const handleToggleAudio = async () => {
    const enabled = await webrtcService.toggleAudio();
    setIsAudioEnabled(enabled);
  };

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      await webrtcService.stopScreenShare();
      setIsScreenSharing(false);
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach((track) => track.stop());
        screenShareStreamRef.current = null;
      }
    } else {
      const stream = await webrtcService.startScreenShare();
      if (stream) {
        screenShareStreamRef.current = stream;
        setIsScreenSharing(true);


        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    }
  };

  const handleEndCall = async () => {
    await webrtcService.disconnect();
    if (onEndCall) {
      onEndCall();
    } else {
      navigate(-1);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Connection Error</h2>
          <p className="text-gray-400">{error}</p>
          <Button onClick={handleEndCall} variant="destructive">
            End Call
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-50" />

      { }
      <div className="absolute top-6 right-6 z-20">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border ${connectionState === 'connected'
          ? 'bg-green-500/10 border-green-500/20 text-green-400'
          : 'bg-slate-800/50 border-slate-700 text-slate-400'
          }`}>
          <div className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
            }`} />
          <span className="text-xs font-medium capitalize">{connectionState}</span>
        </div>
      </div>

      { }
      <div className="flex-1 relative flex items-center justify-center p-4">
        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10 transition-all duration-500">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary relative z-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium tracking-tight">Establishing Secure Connection</h3>
                <p className="text-slate-400 text-sm">Please wait while we connect you...</p>
              </div>
            </div>
          </div>
        )}

        { }
        <div className="w-full h-full max-w-6xl max-h-[calc(100vh-160px)] relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-slate-800/50 mx-auto">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            onCanPlay={() => {
              console.log('Remote video can play');
              remoteVideoRef.current?.play().catch(e => console.error('Error playing remote video:', e));
            }}
            className="w-full h-full object-contain bg-black"
          />

          {!isRemoteVideoEnabled && connectionState === 'connected' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-md z-10">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto ring-1 ring-white/10 shadow-xl">
                  <VideoOff className="w-10 h-10 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-slate-200">
                    {remoteUserName || 'Participant'} has turned off video
                  </p>
                  <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5">
                    {!isRemoteAudioEnabled && <MicOff className="w-3.5 h-3.5 text-red-400" />}
                    {isRemoteAudioEnabled ? 'You can still hear them' : 'Microphone is also muted'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {connectionState === 'connected' && !isRemoteAudioEnabled && (
            <div className="absolute top-6 right-6 z-30">
              <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 text-red-400">
                <MicOff className="w-4 h-4" />
                <span className="text-xs font-medium">Muted</span>
              </div>
            </div>
          )}

          { }
          {connectionState === 'connected' && (remoteUserId || remoteUserName) && (
            <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-sm font-medium text-white/90 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                {remoteUserName || 'Participant'}
              </div>
            </div>
          )}

          {connectionState !== 'connected' && !isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md px-6">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md ring-1 ring-white/10">
                  <div className="w-16 h-16 rounded-full border-2 border-slate-600 border-t-primary animate-spin" />
                </div>
                <h3 className="text-xl font-medium text-slate-200">
                  {remoteUserName ? `Connecting to ${remoteUserName}...` : (remoteUserId ? 'Connecting...' : 'Waiting for participant...')}
                </h3>
                <p className="text-slate-500 text-sm">
                  {remoteUserId
                    ? "Establishing a secure connection. This should only take a moment."
                    : "The stream will start automatically once they join the room."}
                </p>
              </div>
            </div>
          )}
        </div>

        { }
        <div className="absolute top-6 left-6 w-72 aspect-video rounded-xl overflow-hidden bg-slate-800 ring-1 ring-white/10 shadow-2xl transition-all hover:scale-105 hover:ring-white/20 z-20 group">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            onCanPlay={() => {
              localVideoRef.current?.play().catch(e => console.log('Local video play suppressed (expected):', e.message));
            }}
            className="w-full h-full object-cover transform"
          />
          {!isAudioEnabled && isVideoEnabled && (
            <div className="absolute top-3 right-3 p-1.5 bg-red-500 rounded-full shadow-lg z-30 animate-in fade-in zoom-in duration-300">
              <MicOff className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 z-10">
              <div className="p-3 bg-slate-700/50 rounded-full mb-2">
                <VideoOff className="w-6 h-6 text-slate-400" />
              </div>
              {!isAudioEnabled && (
                <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-medium">
                  <MicOff className="w-3 h-3" />
                  <span>Muted</span>
                </div>
              )}
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-[10px] px-2 py-0.5 rounded font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            You
          </div>
        </div>
      </div>

      { }
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-2xl">
          <Button
            onClick={handleToggleAudio}
            variant="ghost"
            size="icon"
            className={`rounded-full w-12 h-12 transition-all duration-300 ${isAudioEnabled
              ? 'bg-slate-800 hover:bg-slate-700 text-white ring-1 ring-white/5'
              : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 ring-1 ring-red-500/20'
              }`}
          >
            {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          <Button
            onClick={handleToggleVideo}
            variant="ghost"
            size="icon"
            className={`rounded-full w-12 h-12 transition-all duration-300 ${isVideoEnabled
              ? 'bg-slate-800 hover:bg-slate-700 text-white ring-1 ring-white/5'
              : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 ring-1 ring-red-500/20'
              }`}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>

          <Button
            onClick={handleScreenShare}
            variant="ghost"
            size="icon"
            className={`rounded-full w-12 h-12 transition-all duration-300 ${isScreenSharing
              ? 'bg-blue-500 text-white ring-1 ring-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
              : 'bg-slate-800 hover:bg-slate-700 text-white ring-1 ring-white/5'
              }`}
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <div className="w-px h-8 bg-white/10 mx-2" />

          <Button
            onClick={handleEndCall}
            variant="destructive"
            size="icon"
            className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all hover:scale-110"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};


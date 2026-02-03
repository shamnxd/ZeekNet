import { socketService } from './socket.service';

export interface WebRTCCallbacks {
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onError?: (error: Error) => void;
  onUserJoined?: (userId: string, userName?: string) => void;
  onUserLeft?: () => void;
  onMediaToggle?: (data: { type: 'video' | 'audio'; enabled: boolean }) => void;
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private roomId: string | null = null;
  private callbacks: WebRTCCallbacks = {};
  private socket: ReturnType<typeof socketService.getSocket> | null = null;
  private userName: string | null = null;

  constructor() {
  }


  private setupSocketListeners(): void {
    const socket = socketService.getSocket();
    if (!socket) return;
    this.socket = socket;

    
    this.handleOffer = this.handleOffer.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
    this.handleIceCandidate = this.handleIceCandidate.bind(this);
    this.handleUserJoined = this.handleUserJoined.bind(this);
    this.handleUserLeftData = this.handleUserLeftData.bind(this);

    socket.on('webrtc:offer', this.handleOffer);
    socket.on('webrtc:answer', this.handleAnswer);
    socket.on('webrtc:ice-candidate', this.handleIceCandidate);
    socket.on('webrtc:user-joined', this.handleUserJoined);
    socket.on('webrtc:user-left', this.handleUserLeftData);
    socket.on('webrtc:media-toggle', (data: { type: 'video' | 'audio'; enabled: boolean }) => {
      console.log('Remote media toggle:', data);
      this.callbacks.onMediaToggle?.(data);
    });
  }

  private cleanupSocketListeners(): void {
    if (!this.socket) return;
    
    this.socket.off('webrtc:offer', this.handleOffer);
    this.socket.off('webrtc:answer', this.handleAnswer);
    this.socket.off('webrtc:ice-candidate', this.handleIceCandidate);
    this.socket.off('webrtc:user-joined', this.handleUserJoined);
    this.socket.off('webrtc:user-left', this.handleUserLeftData);
    this.socket.off('webrtc:media-toggle');
  }

  
  private async handleOffer(data: { offer: RTCSessionDescriptionInit; socketId: string; userName?: string }) {
      if (!this.peerConnection) return;
      
      console.log('Received Offer from', data.socketId);
      console.log('Remote Offer SDP:', data.offer.sdp); 
      console.log('Current Signaling State:', this.peerConnection.signalingState);

      try {
        console.log('Setting Remote Description (Offer)...');
        if (data.userName) {
          this.callbacks.onUserJoined?.('', data.userName);
        }
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        
        console.log('Creating Answer...');
        const answer = await this.peerConnection.createAnswer();
        console.log('Local Answer SDP:', answer.sdp); 
        
        console.log('Setting Local Description (Answer)...');
        await this.peerConnection.setLocalDescription(answer);

        console.log('Sending Answer...');
        this.socket?.emit('webrtc:answer', {
          roomId: this.roomId,
          answer: answer,
          targetSocketId: data.socketId,
          userName: this.userName,
        });
      } catch (error) {
        console.error('Error handling offer:', error);
        this.callbacks.onError?.(new Error('Failed to handle offer'));
      }
  }

  private async handleAnswer(data: { answer: RTCSessionDescriptionInit; socketId: string; userName?: string }) {
      if (!this.peerConnection) return;
      
      console.log('Received Answer from', data.socketId);
      console.log('Remote Answer SDP:', data.answer.sdp); 
      const state = this.peerConnection.signalingState;
      console.log('Current Signaling State:', state);
      
      
      if (state !== 'have-local-offer' && state !== 'have-local-pranswer') {
        console.warn(`Received answer in invalid state: ${state}. Expected 'have-local-offer'. Ignoring.`);
        return;
      }

      try {
        console.log('Setting Remote Description (Answer)...');
        if (data.userName) {
          this.callbacks.onUserJoined?.('', data.userName);
        }
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        console.log('Remote Description Set. Connection should be stable.');
      } catch (error) {
        console.error('Error handling answer:', error);
        
        this.callbacks.onError?.(new Error(`Failed to handle answer: ${error instanceof Error ? error.message : String(error)}`));
      }
  }

  private async handleIceCandidate(data: { candidate: RTCIceCandidateInit; socketId: string }) {
      if (!this.peerConnection) return;
      try {
        console.log('Received ICE Candidate from', data.socketId, data.candidate.candidate);
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
  }

  private handleUserJoined(data: { socketId: string; userId: string; userName?: string }) {
      console.log('User joined room:', data);
      this.callbacks.onUserJoined?.(data.userId, data.userName);
  }

  private handleUserLeftData(data: { socketId: string }) {
      console.log('User left room:', data);
      this.callbacks.onUserLeft?.();
      this.handleUserLeft();
  }



  private initializationId: number = 0;

  async initialize(roomId: string, callbacks: WebRTCCallbacks, userName?: string): Promise<void> {
    
    this.disconnect(); 
    
    
    const currentInitId = ++this.initializationId;

    this.roomId = roomId;
    this.callbacks = callbacks;
    this.userName = userName || null;
    this.remoteStream = null; // Reset remote stream on new initialization
    
    
    this.socket = socketService.getSocket();
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    
    this.setupSocketListeners();

    
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.socket && this.roomId) {
        console.log('Local ICE Candidate gathered:', event.candidate.candidate);
        this.socket.emit('webrtc:ice-candidate', {
          roomId: this.roomId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    
    this.peerConnection.ontrack = (event) => {
      console.log('Remote track received:', event.track.kind, 'streams:', event.streams.length);
      
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
        this.remoteStream.addTrack(event.track);
        this.callbacks.onRemoteStream?.(this.remoteStream);
      } else {
        this.remoteStream.addTrack(event.track);
      }

      event.track.onmute = () => {
        console.log('Remote track muted:', event.track.kind);
        this.callbacks.onMediaToggle?.({ type: event.track.kind as 'video' | 'audio', enabled: false });
      };
      
      event.track.onunmute = () => {
        console.log('Remote track unmuted:', event.track.kind);
        this.callbacks.onMediaToggle?.({ type: event.track.kind as 'video' | 'audio', enabled: true });
      };

      console.log('Track added to remote stream. Total tracks:', this.remoteStream.getTracks().length);
    };

    
    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        console.log('Peer Connection State changed:', this.peerConnection.connectionState);
        this.callbacks.onConnectionStateChange?.(this.peerConnection.connectionState);
      }
    };

    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      
      if (this.initializationId !== currentInitId) {
        console.warn('Initialization aborted due to new request.');
        stream.getTracks().forEach(t => t.stop()); 
        return;
      }

      this.localStream = stream;

      if (this.peerConnection) {
        this.localStream.getTracks().forEach(track => {
          console.log('Adding local track to peer connection:', track.kind);
          this.peerConnection?.addTrack(track, this.localStream!);
        });
      }

    } catch (error) {
      console.error('Error accessing media devices:', error);
      this.callbacks.onError?.(new Error('Failed to access camera/microphone'));
      throw error;
    }

    
    if (this.socket) {
      this.socket.emit('webrtc:join-room', { roomId, userName }, (response: { success: boolean; participants?: number; message?: string }) => {
        
        if (this.initializationId !== currentInitId) return;

        if (response.success) {
          console.log(`Joined room ${roomId}, participants: ${response.participants || 0}`);
          
          if (response.participants && response.participants > 0) {
            console.log('Other participants found, initiating call in 1 second...');
            setTimeout(() => {
              if (this.initializationId === currentInitId) {
                this.createOffer();
              }
            }, 1000);
          } else {
            console.log('No other participants, waiting for connection...');
          }
        } else {
          console.error('Failed to join room:', response.message);
          this.callbacks.onError?.(new Error(response.message || 'Failed to join room'));
        }
      });
    }
  }

  private async createOffer(): Promise<void> {
    if (!this.peerConnection || !this.socket || !this.roomId) return;

    try {
      console.log('Creating Offer...');
      const offer = await this.peerConnection.createOffer();
      console.log('Local Offer SDP:', offer.sdp); 
      
      console.log('Setting Local Description (Offer)...');
      await this.peerConnection.setLocalDescription(offer);

      console.log(`Sending Offer to room ${this.roomId}`);
      this.socket.emit('webrtc:offer', {
        roomId: this.roomId,
        offer: offer,
        userName: this.userName,
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      this.callbacks.onError?.(new Error('Failed to create offer'));
    }
  }

  
  

  async toggleVideo(): Promise<boolean> {
    if (!this.localStream) return false;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      
      if (this.socket && this.roomId) {
        this.socket.emit('webrtc:media-toggle', {
          roomId: this.roomId,
          type: 'video',
          enabled: videoTrack.enabled
        });
      }
      
      return videoTrack.enabled;
    }
    return false;
  }

  async toggleAudio(): Promise<boolean> {
    if (!this.localStream) return false;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;

      if (this.socket && this.roomId) {
        this.socket.emit('webrtc:media-toggle', {
          roomId: this.roomId,
          type: 'audio',
          enabled: audioTrack.enabled
        });
      }

      return audioTrack.enabled;
    }
    return false;
  }

  async startScreenShare(): Promise<MediaStream | null> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      
      const videoTrack = screenStream.getVideoTracks()[0];
      if (this.peerConnection && this.localStream) {
        const sender = this.peerConnection.getSenders().find(
          (s) => s.track && s.track.kind === 'video'
        );
        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack);
        }
      }

      
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      return screenStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      this.callbacks.onError?.(new Error('Failed to start screen share'));
      return null;
    }
  }

  async stopScreenShare(): Promise<void> {
    if (!this.localStream) return;

    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      const videoTrack = cameraStream.getVideoTracks()[0];
      if (this.peerConnection) {
        const sender = this.peerConnection.getSenders().find(
          (s) => s.track && s.track.kind === 'video'
        );
        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack);
        }
      }

      cameraStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  private handleUserLeft(): void {
    
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }
  }

  async disconnect(): Promise<void> {
    
    this.cleanupSocketListeners();
    
    
    if (this.socket && this.roomId) {
      this.socket.emit('webrtc:leave-room', { roomId: this.roomId });
    }

    
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }

    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.roomId = null;
    this.callbacks = {};
  }
}

export const webrtcService = new WebRTCService();


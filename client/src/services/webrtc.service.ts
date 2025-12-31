import { socketService } from './socket.service';

export interface WebRTCCallbacks {
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onError?: (error: Error) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: () => void;
}

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private roomId: string | null = null;
  private callbacks: WebRTCCallbacks = {};
  private socket: ReturnType<typeof socketService.getSocket> | null = null;

  constructor() {
    // Socket listener setup is now handled in initialize()
  }


  private setupSocketListeners(): void {
    const socket = socketService.getSocket();
    if (!socket) return;
    this.socket = socket;

    // Use a unique handler for each event to allow proper removal
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
  }

  private cleanupSocketListeners(): void {
    if (!this.socket) return;
    
    this.socket.off('webrtc:offer', this.handleOffer);
    this.socket.off('webrtc:answer', this.handleAnswer);
    this.socket.off('webrtc:ice-candidate', this.handleIceCandidate);
    this.socket.off('webrtc:user-joined', this.handleUserJoined);
    this.socket.off('webrtc:user-left', this.handleUserLeftData);
  }

  // Event Handlers
  private async handleOffer(data: { offer: RTCSessionDescriptionInit; socketId: string }) {
      if (!this.peerConnection) return;
      
      console.log('Received Offer from', data.socketId);
      console.log('Remote Offer SDP:', data.offer.sdp); // [DEBUG] Log full SDP
      console.log('Current Signaling State:', this.peerConnection.signalingState);

      try {
        console.log('Setting Remote Description (Offer)...');
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        
        console.log('Creating Answer...');
        const answer = await this.peerConnection.createAnswer();
        console.log('Local Answer SDP:', answer.sdp); // [DEBUG] Log full SDP
        
        console.log('Setting Local Description (Answer)...');
        await this.peerConnection.setLocalDescription(answer);

        console.log('Sending Answer...');
        this.socket?.emit('webrtc:answer', {
          roomId: this.roomId,
          answer: answer,
          targetSocketId: data.socketId,
        });
      } catch (error) {
        console.error('Error handling offer:', error);
        this.callbacks.onError?.(new Error('Failed to handle offer'));
      }
  }

  private async handleAnswer(data: { answer: RTCSessionDescriptionInit; socketId: string }) {
      if (!this.peerConnection) return;
      
      console.log('Received Answer from', data.socketId);
      console.log('Remote Answer SDP:', data.answer.sdp); // [DEBUG] Log full SDP
      const state = this.peerConnection.signalingState;
      console.log('Current Signaling State:', state);
      
      // Strict State Check: We can only handle an answer if we are expecting one.
      if (state !== 'have-local-offer' && state !== 'have-local-pranswer') {
        console.warn(`Received answer in invalid state: ${state}. Expected 'have-local-offer'. Ignoring.`);
        return;
      }

      try {
        console.log('Setting Remote Description (Answer)...');
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        console.log('Remote Description Set. Connection should be stable.');
      } catch (error) {
        console.error('Error handling answer:', error);
        // Pass the actual error message for better debugging
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

  private handleUserJoined(data: { socketId: string; userId: string }) {
      console.log('User joined room:', data);
      this.callbacks.onUserJoined?.(data.userId);
  }

  private handleUserLeftData(data: { socketId: string }) {
      console.log('User left room:', data);
      this.callbacks.onUserLeft?.();
      this.handleUserLeft();
  }



  private initializationId: number = 0;

  async initialize(roomId: string, callbacks: WebRTCCallbacks): Promise<void> {
    // Ideally cleanup any previous session first to be safe
    this.disconnect(); 
    
    // Increment Init ID to invalidate any pending previous initializations
    const currentInitId = ++this.initializationId;

    this.roomId = roomId;
    this.callbacks = callbacks;
    
    // Ensure we have the latest socket
    this.socket = socketService.getSocket();
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    // Setup listeners (disconnect() above handles cleanup, but we ensure setup is clean)
    this.setupSocketListeners();

    // Create peer connection with STUN servers
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.socket && this.roomId) {
        console.log('Local ICE Candidate gathered:', event.candidate.candidate);
        this.socket.emit('webrtc:ice-candidate', {
          roomId: this.roomId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      if (event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.callbacks.onRemoteStream?.(event.streams[0]);
      }
    };

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      if (this.peerConnection) {
        this.callbacks.onConnectionStateChange?.(this.peerConnection.connectionState);
      }
    };

    // Get local media stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Race Condition Check: If a new initialize called started while we were waiting, stop here.
      if (this.initializationId !== currentInitId) {
        console.warn('Initialization aborted due to new request.');
        stream.getTracks().forEach(t => t.stop()); // Stop this stale stream
        return;
      }

      this.localStream = stream;

      // Explicitly Add Transceivers to enforce order: Audio, then Video
      // This ensures SDP always has m=audio then m=video, preventing mismatch errors.
      if (this.peerConnection) {
        const audioTrack = this.localStream.getAudioTracks()[0];
        const videoTrack = this.localStream.getVideoTracks()[0];

        // Audio Transceiver (Always 1st)
        if (audioTrack) {
          this.peerConnection.addTransceiver(audioTrack, { direction: 'sendrecv', streams: [this.localStream] });
        } else {
          this.peerConnection.addTransceiver('audio', { direction: 'sendrecv' });
        }

        // Video Transceiver (Always 2nd)
        if (videoTrack) {
          this.peerConnection.addTransceiver(videoTrack, { direction: 'sendrecv', streams: [this.localStream] });
        } else {
          this.peerConnection.addTransceiver('video', { direction: 'sendrecv' });
        }
      }

    } catch (error) {
      console.error('Error accessing media devices:', error);
      this.callbacks.onError?.(new Error('Failed to access camera/microphone'));
      throw error;
    }

    // Join room
    if (this.socket) {
      this.socket.emit('webrtc:join-room', { roomId }, (response: { success: boolean; participants?: number }) => {
        // Race Condition Check again
        if (this.initializationId !== currentInitId) return;

        if (response.success) {
          console.log(`Joined room ${roomId}, participants: ${response.participants || 0}`);
          
          // Dynamic Initiation Logic:
          // Check if there are other participants
          if (response.participants && response.participants > 0) {
            console.log('Other participants found, initiating call...');
            this.createOffer();
          } else {
            console.log('No other participants, waiting for connection...');
          }
        }
      });
    }
  }

  private async createOffer(): Promise<void> {
    if (!this.peerConnection || !this.socket || !this.roomId) return;

    try {
      console.log('Creating Offer...');
      const offer = await this.peerConnection.createOffer();
      console.log('Local Offer SDP:', offer.sdp); // [DEBUG] Log full SDP
      
      console.log('Setting Local Description (Offer)...');
      await this.peerConnection.setLocalDescription(offer);

      console.log(`Sending Offer to room ${this.roomId}`);
      this.socket.emit('webrtc:offer', {
        roomId: this.roomId,
        offer: offer,
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      this.callbacks.onError?.(new Error('Failed to create offer'));
    }
  }

  // ... (toggleVideo, toggleAudio, startScreenShare, stopScreenShare methods remain the same) ...
  // Re-implementing toggleVideo/Audio/etc to ensure they are preserved in replacement if they were in the range

  async toggleVideo(): Promise<boolean> {
    if (!this.localStream) return false;

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      return videoTrack.enabled;
    }
    return false;
  }

  async toggleAudio(): Promise<boolean> {
    if (!this.localStream) return false;

    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
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

      // Replace video track in peer connection
      const videoTrack = screenStream.getVideoTracks()[0];
      if (this.peerConnection && this.localStream) {
        const sender = this.peerConnection.getSenders().find(
          (s) => s.track && s.track.kind === 'video'
        );
        if (sender && videoTrack) {
          await sender.replaceTrack(videoTrack);
        }
      }

      // Stop screen share when user stops sharing
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
    // Handle when remote user leaves
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }
  }

  async disconnect(): Promise<void> {
    // Cleanup listeners
    this.cleanupSocketListeners();
    
    // Leave room
    if (this.socket && this.roomId) {
      this.socket.emit('webrtc:leave-room', { roomId: this.roomId });
    }

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    // Stop remote stream
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.roomId = null;
    this.callbacks = {};
  }
}

export const webrtcService = new WebRTCService();


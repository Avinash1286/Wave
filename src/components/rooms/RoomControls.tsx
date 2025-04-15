import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Hand, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import LeaveRoomDialog from './LeaveRoomDialog';

interface RoomControlsProps {
  onLeaveRoom: () => void;
  setIsSpeaking?: (isSpeaking: boolean) => void;
  roomName: string;
  isHost?: boolean;
  onHandRaise?: () => void;
  handRaised?: boolean;
}

const RoomControls: React.FC<RoomControlsProps> = ({ onLeaveRoom, setIsSpeaking, roomName, isHost, onHandRaise, handRaised }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [localIsSpeaking, setLocalIsSpeaking] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const localStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const speakingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start or stop the microphone
  const toggleMic = async () => {
    if (!isHost) {
      toast.error('Only the host can speak in this room.');
      return;
    }
    if (isMicActive) {
      // Stop everything and reset
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      if (speakingIntervalRef.current) {
        clearInterval(speakingIntervalRef.current);
        speakingIntervalRef.current = null;
      }
      setIsMicActive(false);
      setLocalIsSpeaking(false);
      if (setIsSpeaking) setIsSpeaking(false);
      toast('Microphone stopped');
      setIsMuted(false); // Always reset mute
      console.log('Mic stopped');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        setIsMicActive(true);
        setIsMuted(false); // Always unmute on mic start
        toast('Microphone started');
        console.log('Mic started');
        // Setup analyser for speaking detection
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        analyserRef.current = analyser;
        const dataArray = new Uint8Array(analyser.fftSize);
        speakingIntervalRef.current = setInterval(() => {
          analyser.getByteTimeDomainData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const val = (dataArray[i] - 128) / 128;
            sum += val * val;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const speaking = rms > 0.015 && !isMuted;
          setLocalIsSpeaking(speaking);
          if (setIsSpeaking) setIsSpeaking(speaking);
          if (speaking) {
            console.log('Speaking detected (RMS):', rms);
          }
        }, 100);
      } catch (err) {
        toast.error('Microphone access denied');
        console.error('Microphone access denied', err);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
    toast(isMuted ? 'You are unmuted' : 'You are muted');
  };
  
  const handleLeaveRoom = () => {
    setIsLeaveDialogOpen(true);
  };

  const handleLeaveConfirm = () => {
    onLeaveRoom();
    setIsLeaveDialogOpen(false);
  };

  const handleMicButtonClick = () => {
    toggleMic(); // Always toggle mic on/off
  };

  return (
    <>
      <div className="inline-flex bg-card border border-border rounded-full py-3 px-4 items-center justify-center gap-4">
        <TooltipProvider>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mic button always visible, but only host can speak */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={
                    !isMicActive ? "outline"
                    : isMuted ? "destructive"
                    : "default"
                  }
                  className={cn(
                    "h-10 w-10 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg relative overflow-hidden",
                    isMicActive && !isMuted && "bg-primary hover:bg-primary/90 hover:shadow-primary/25",
                    !isMicActive && "bg-transparent text-foreground border border-border",
                    isMuted && "bg-destructive hover:bg-destructive/90"
                  )}
                  onClick={handleMicButtonClick}
                  disabled={!isHost}
                >
                  <div className="absolute inset-0">
                    {isMicActive && !isMuted && (
                      <>
                        <span className="absolute inset-0 rounded-full animate-[ripple_2s_linear_infinite] opacity-0 bg-primary/40" />
                        <span className="absolute inset-0 rounded-full animate-[ripple_2s_linear_infinite_500ms] opacity-0 bg-primary/40" />
                      </>
                    )}
                  </div>
                  <span className="relative z-10">
                    {!isMicActive ? <MicOff className="h-5 w-5" /> : (isMuted ? <MicOff className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5 text-primary-foreground" />)}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isHost ? (!isMicActive ? 'Start Mic' : (isMuted ? 'Unmute' : 'Mute')) : 'Only host can speak'}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={handRaised ? "secondary" : "outline"}
                  className={cn(
                    "h-10 w-10 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg",
                    handRaised && "bg-amber-400 text-amber-50 hover:bg-amber-500 hover:shadow-amber-400/25 border-amber-400"
                  )}
                  onClick={onHandRaise}
                >
                  <Hand className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{handRaised ? "Lower hand" : "Raise hand"}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-10 w-10 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-destructive/25"
                  onClick={handleLeaveRoom}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Leave room</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      
      <LeaveRoomDialog
        open={isLeaveDialogOpen}
        onOpenChange={setIsLeaveDialogOpen}
        onConfirm={handleLeaveConfirm}
        roomName={roomName}
      />
    </>
  );
};

export default RoomControls;

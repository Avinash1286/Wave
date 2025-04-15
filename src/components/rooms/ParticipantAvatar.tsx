import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Hand } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SpeakingIndicator from './SpeakingIndicator';

export interface Participant {
  id: string;
  name: string;
  imageUrl?: string;
  isSpeaker: boolean;
  isMuted: boolean;
  isHost: boolean;
  isSpeaking: boolean;
  hasRaisedHand: boolean;
}

interface ParticipantAvatarProps {
  participant: Participant;
  size?: 'sm' | 'md' | 'lg';
  liveIsSpeaking?: boolean;
}

const ParticipantAvatar: React.FC<ParticipantAvatarProps> = ({ 
  participant, 
  size = 'md',
  liveIsSpeaking
}) => {
  const [isSpeaking, setIsSpeaking] = useState(participant.isSpeaking);
  
  useEffect(() => {
    if (typeof liveIsSpeaking === 'boolean') {
      setIsSpeaking(liveIsSpeaking);
      return;
    }
    if (!participant.isSpeaker || participant.isMuted) {
      setIsSpeaking(false);
      return;
    }
    if (participant.isSpeaking) {
      const interval = setInterval(() => {
        setIsSpeaking(prev => !prev);
      }, Math.random() * 2000 + 1000);
      return () => clearInterval(interval);
    }
  }, [participant.isSpeaker, participant.isMuted, participant.isSpeaking, liveIsSpeaking]);
  
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <Avatar className={cn(
          sizeClasses[size],
          (isSpeaking && !participant.isMuted && participant.isHost) && "active-speaker",
        )}>
          <AvatarImage src={participant.imageUrl} alt={participant.name} />
          <AvatarFallback className="bg-primary/20 text-primary-foreground">
            {getInitials(participant.name)}
          </AvatarFallback>
        </Avatar>
        
        {/* Status indicators */}
        <div className="absolute -bottom-1 -right-1 flex">
          {participant.isSpeaker && (
            <div className={cn(
              "rounded-full w-6 h-6 flex items-center justify-center text-xs",
              "bg-card border border-border shadow-sm"
            )}>
              {participant.isMuted ? (
                <MicOff className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Mic className="h-3 w-3 text-primary" />
              )}
            </div>
          )}
          
          {participant.hasRaisedHand && (
            <div className={cn(
              "rounded-full w-6 h-6 flex items-center justify-center",
              "bg-amber-400 text-amber-50 ml-1 animate-bounce"
            )}>
              <Hand className="h-3 w-3" />
            </div>
          )}
        </div>
        
        {participant.isHost && (
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
            Host
          </div>
        )}
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium line-clamp-1 max-w-[100px]">
          {participant.name}
        </div>
        <div style={{ minHeight: 25 }}>
          {isSpeaking && !participant.isMuted && participant.isHost && (
            <SpeakingIndicator className="mx-auto mt-1" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantAvatar;

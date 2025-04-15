import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ParticipantAvatar, { Participant } from '@/components/rooms/ParticipantAvatar';
import RoomControls from '@/components/rooms/RoomControls';
import ReactionBar from '@/components/rooms/ReactionBar';
import TranscriptDisplay from '@/components/rooms/TranscriptDisplay';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getRoomsFromStorage } from '@/utils/localStorage';
import { getMockRoomDetail } from '@/data/mockData';
import { getCurrentUser } from '@/utils/auth';

// Tag to image mapping
const getImageForTags = (tags?: string[]): string => {
  if (!tags || tags.length === 0) return '/placeholder.svg';
  
  // Define tag keywords and their corresponding images
  const tagImageMap: Record<string, string> = {
    'technology': '/images/ai.jpeg',
    'tech': '/images/ai.jpeg',
    'ai': '/images/ai.jpg',
    'wellness': '/images/medetation.jpeg',
    'meditation': '/images/medetation.jpg',
    'business': '/images/startup.jpeg',
    'startup': '/images/startup.jpeg',
    'music': '/images/music.jpeg',
    'fitness': '/images/fitness.jpeg',
    'health': '/images/fitness.jpeg',
    'books': '/images/book.jpeg',
    'reading': '/images/book.jpeg',
    'travel': '/images/travel.jpeg',
    'crypto': '/images/crypto.jpeg'
  };
  
  // Find the first matching tag
  const matchingTag = tags.find(tag => 
    Object.keys(tagImageMap).includes(tag.toLowerCase())
  );
  
  return matchingTag ? tagImageMap[matchingTag.toLowerCase()] : '/placeholder.svg';
};

// Add audio references
const joinSound = new Audio('/audio/joincall.mp3');
const leaveSound = new Audio('/audio/leavecall.mp3');

// Map of keywords to audio files
const audioMap = {
  'book': '/audio/bookclub.mp3',
  'crypto': '/audio/crypto.mp3',
  'fitness': '/audio/fitness.mp3',
  'ai': '/audio/futureofai.mp3',
  'robot': '/audio/llminrobotics.mp3',
  'meditation': '/audio/medetation.mp3',
  'music': '/audio/musicproduction.mp3',
  'startup': '/audio/startup.mp3',
  'tech': '/audio/techtrend.mp3',
  'travel': '/audio/travel.mp3',
  'update': '/audio/updateinmusic.mp3'
};

const getRelevantAudio = (roomName: string, tags?: string[]) => {
  const combinedText = (roomName + ' ' + (tags?.join(' ') || '')).toLowerCase();
  
  // Find the first matching keyword in the combined text
  const matchingKeyword = Object.keys(audioMap).find(keyword => 
    combinedText.includes(keyword)
  );
  
  return matchingKeyword ? new Audio(audioMap[matchingKeyword]) : null;
};

const RoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [roomData, setRoomData] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false); 
  const [floatingReactions, setFloatingReactions] = useState<{emoji: string; id: number;}[]>([]);
  const [transcript, setTranscript] = useState('');
  const [isTranscriptFinal, setIsTranscriptFinal] = useState(false);
  const reactionIdRef = React.useRef(0);
  const recognitionRef = useRef<any>(null);
  const joinAudioRef = useRef<HTMLAudioElement | null>(null);
  const topicAudioRef = useRef<HTMLAudioElement | null>(null);
  const leaveAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [localHandRaised, setLocalHandRaised] = useState(false);
  const currentUser = getCurrentUser();

  // Helper to stop all audios
  const stopAllAudio = () => {
    joinAudioRef.current?.pause();
    joinAudioRef.current && (joinAudioRef.current.currentTime = 0);
    topicAudioRef.current?.pause();
    topicAudioRef.current && (topicAudioRef.current.currentTime = 0);
  };

  useEffect(() => {
    if (!id) return;
    let unmounted = false;
    const fetchRoomData = async () => {
      setIsLoading(true);
      
      try {
        // First check if room exists in local storage
        const storedRooms = getRoomsFromStorage();
        const storedRoom = storedRooms.find(room => room.id === id);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let data;
        if (storedRoom) {
          // If found in local storage, use that data
          data = {
            ...storedRoom,
            // Add mock participants since we don't store those in local storage
            participants: getMockRoomDetail(id)?.participants || []
          };
        } else {
          // Fallback to mock data if not in local storage
          data = getMockRoomDetail(id);
        }
        
        if (!data) {
          toast.error("Room not found");
          navigate('/');
          return;
        }
        
        // Insert current user as first listener if not host/speaker
        if (currentUser) {
          const isAlreadyParticipant = data.participants.some((p: Participant) => p.id === currentUser.id);
          if (!isAlreadyParticipant) {
            const userParticipant: Participant = {
              id: currentUser.id,
              name: currentUser.username,
              imageUrl: currentUser.avatarUrl,
              isSpeaker: false,
              isMuted: true,
              isHost: false,
              isSpeaking: false,
              hasRaisedHand: false,
            };
            // Add as first listener
            const listeners = data.participants.filter((p: Participant) => !p.isSpeaker && !p.isHost);
            const others = data.participants.filter((p: Participant) => p.isSpeaker || p.isHost);
            data.participants = [...others, userParticipant, ...listeners];
          }
        }

        setRoomData(data);
        setParticipants(data.participants);
        toast.success(`Joined ${data.name}`);
        
        // Play joincall.mp3, then topic audio
        if (!audioPlayed) {
          const joinAudio = new Audio('/audio/joincall.mp3');
          joinAudioRef.current = joinAudio;
          const thematicAudio = getRelevantAudio(data.name, data.tags);
          if (thematicAudio) {
            topicAudioRef.current = thematicAudio;
            joinAudio.onended = () => {
              if (!unmounted) {
                thematicAudio.play().catch(console.error);
              }
            };
            joinAudio.play().catch(console.error);
          } else {
            joinAudio.play().catch(console.error);
          }
          setAudioPlayed(true);
        }
      } catch (error) {
        console.error('Error fetching room:', error);
        toast.error("Failed to join room");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoomData();
    // Cleanup on unmount or navigation
    return () => {
      unmounted = true;
      stopAllAudio();
    };
  }, [id, navigate]);

  // Stop audio on browser back/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopAllAudio();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;
    console.log('Transcript effect: isSpeaking', isSpeaking);
    // Only start if mic is active (isSpeaking or isMicActive)
    if (isSpeaking) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
          console.warn('SpeechRecognition API not available');
          return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptPiece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcriptPiece;
            } else {
              interim += transcriptPiece;
            }
          }
          setTranscript(final + interim);
          setIsTranscriptFinal(!!final && !interim);
          console.log('Transcript updated:', final + interim);
        };
        recognition.onerror = (event: any) => {
          console.error('SpeechRecognition error:', event);
        };
        recognition.onend = () => {
          console.log('SpeechRecognition ended');
        };
        recognition.start();
        recognitionRef.current = recognition;
        console.log('SpeechRecognition started');
      } catch (e) {
        console.error('SpeechRecognition exception:', e);
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
        setIsTranscriptFinal(false);
        console.log('SpeechRecognition stopped');
      }
    }
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
        console.log('SpeechRecognition cleaned up');
      }
    };
  }, [isSpeaking]);

  const handleLeaveRoom = () => {
    stopAllAudio();
    // Play leavecall.mp3, then navigate
    const leaveAudio = new Audio('/audio/leavecall.mp3');
    leaveAudioRef.current = leaveAudio;
    leaveAudio.onended = () => {
      navigate('/');
      toast.info('You left the room');
    };
    leaveAudio.play().catch(() => {
      navigate('/');
      toast.info('You left the room');
    });
  };

  const handleReaction = (emoji: string) => {
    const id = reactionIdRef.current++;
    setFloatingReactions(reactions => [...reactions, { emoji, id }]);
    // Remove after animation (e.g., 1.5s)
    setTimeout(() => {
      setFloatingReactions(reactions => reactions.filter(r => r.id !== id));
    }, 1500);
  };

  // Group participants: host first, then speakers, then others
  const groupedParticipants = {
    hosts: participants.filter(p => p.isHost),
    speakers: participants.filter(p => p.isSpeaker && !p.isHost),
    listeners: participants.filter(p => !p.isSpeaker && !p.isHost),
  };

  // Find the local participant by user id
  const localParticipant = currentUser
    ? participants.find(p => p.id === currentUser.id) || groupedParticipants.hosts[0] || participants[0]
    : groupedParticipants.hosts[0] || participants[0];

  // Only host can speak
  const isHost = localParticipant?.isHost;

  // Handler for hand raise toggle
  const handleLocalHandRaise = () => {
    setLocalHandRaised(prev => !prev);
    setParticipants(prev => prev.map(p =>
      p.id === localParticipant.id ? { ...p, hasRaisedHand: !p.hasRaisedHand } : p
    ));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[70vh] flex items-center justify-center">
          <div className="animate-pulse text-center">
            <h2 className="text-2xl font-semibold mb-2">Joining room...</h2>
            <p className="text-muted-foreground">Connecting to the conversation</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!roomData) {
    return (
      <Layout>
        <div className="h-[70vh] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-2">Room not found</h2>
          <p className="text-muted-foreground mb-4">The room you're looking for doesn't exist or has ended</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-screen pb-[4.5rem]">
        {/* Hero section */}
        <div 
          className="relative min-h-[40vh] flex items-center justify-center overflow-hidden rounded-2xl mx-4 mb-8"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${getImageForTags(roomData.tags)}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="text-center px-4 py-16 relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              {roomData.name}
            </h1>
            {roomData.description && (
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {roomData.description}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{roomData.participantCount} participants</span>
              </div>
              {roomData.isLive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>LIVE</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Room content */}
        <div className="flex-1 overflow-y-auto space-y-8 pb-4">
          {/* Hosts and speakers section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Speakers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[...groupedParticipants.hosts, ...groupedParticipants.speakers]
                .map(participant => (
                  <div key={participant.id} className="h-[150px] relative">
                    <ParticipantAvatar
                      key={participant.id}
                      participant={participant}
                      size="lg"
                      liveIsSpeaking={participant.id === localParticipant.id ? isSpeaking : undefined}
                    />
                  </div>
                ))
              }
            </div>
          </div>
          {/* Listeners section */}
          {groupedParticipants.listeners.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Listeners</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {groupedParticipants.listeners.map(participant => (
                  <ParticipantAvatar
                    key={participant.id}
                    participant={participant}
                    size="sm"
                    liveIsSpeaking={participant.id === localParticipant.id ? isSpeaking : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Room controls - fixed at bottom with glass effect */}
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-24 md:pb-4 flex flex-col items-center z-40">
          {/* Live transcript for local user */}
          <TranscriptDisplay transcript={transcript} isFinal={isTranscriptFinal} />
          {/* ReactionBar and floating reactions */}
          <ReactionBar onReact={handleReaction} />
          <div className="pointer-events-none absolute bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-50">
            {floatingReactions.map(r => (
              <span
                key={r.id}
                className="text-4xl animate-float-reaction"
                style={{
                  animation: 'floatUp 1.5s ease-out',
                  position: 'relative',
                  left: `${Math.random() * 60 - 30}px`, // random horizontal offset
                }}
              >
                {r.emoji}
              </span>
            ))}
          </div>
          <RoomControls 
            onLeaveRoom={handleLeaveRoom} 
            setIsSpeaking={isHost ? setIsSpeaking : undefined} 
            roomName={roomData.name}
            isHost={isHost}
            onHandRaise={handleLocalHandRaise}
            handRaised={localParticipant?.hasRaisedHand || false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default RoomPage;

/* Add animation keyframes globally (in your CSS):
@keyframes floatUp {
  0% { opacity: 0; transform: translateY(20px) scale(0.8); }
  30% { opacity: 1; transform: translateY(-10px) scale(1.2); }
  80% { opacity: 1; transform: translateY(-60px) scale(1.1); }
  100% { opacity: 0; transform: translateY(-80px) scale(0.7); }
} */

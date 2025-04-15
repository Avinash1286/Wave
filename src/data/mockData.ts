import { RoomData } from "@/components/rooms/RoomCard";
import { Participant } from "@/components/rooms/ParticipantAvatar";

// Mock room data
export const mockRooms: RoomData[] = [
  {
    id: '1',
    name: 'Tech Talk: Future of AI',
    hostName: 'Sarah Johnson',
    participantCount: 145,
    speakerCount: 3,
    isLive: true,
    tags: ['Technology', 'AI', 'Discussion'],
  },
  {
    id: '2',
    name: 'Meditation & Mindfulness',
    hostName: 'Michael Chen',
    participantCount: 89,
    speakerCount: 2,
    isLive: true,
    tags: ['Wellness', 'Meditation'],
  },
  {
    id: '3',
    name: 'Startup Funding Strategies',
    hostName: 'Alex Rivera',
    participantCount: 112,
    speakerCount: 5,
    isLive: true,
    tags: ['Business', 'Startups', 'Finance'],
  },
  {
    id: '4',
    name: 'Music Production Tips',
    hostName: 'DJ Harmony',
    participantCount: 78,
    speakerCount: 2,
    isLive: true,
    tags: ['Music', 'Production', 'Creative'],
  },
  {
    id: '5',
    name: 'Book Club: "The Midnight Library"',
    hostName: 'Emily Watson',
    participantCount: 52,
    speakerCount: 4,
    isLive: true,
    tags: ['Books', 'Discussion'],
  },
  {
    id: '6',
    name: 'Cryptocurrency Market Analysis',
    hostName: 'Crypto King',
    participantCount: 203,
    speakerCount: 3,
    isLive: true,
    tags: ['Crypto', 'Finance', 'Trading'],
  },
  {
    id: '7',
    name: 'Travel Stories: Southeast Asia',
    hostName: 'Wanderlust Jane',
    participantCount: 67,
    speakerCount: 6,
    isLive: false,
    tags: ['Travel', 'Adventure', 'Stories'],
  },
  {
    id: '8',
    name: 'Fitness Motivation',
    hostName: 'Trainer Tom',
    participantCount: 94,
    speakerCount: 2,
    isLive: true,
    tags: ['Fitness', 'Health', 'Motivation'],
  },
];

// Mock detailed room data with participants
export const getMockRoomDetail = (roomId: string) => {
  const room = mockRooms.find(r => r.id === roomId);
  
  if (!room) return null;
  
  // Generate mock participants based on the room
  const participants: Participant[] = [
    // Host
    {
      id: 'host-1',
      name: room.hostName,
      isSpeaker: true,
      isMuted: false,
      isHost: true,
      isSpeaking: true,
      hasRaisedHand: false,
    },
    // Other speakers
    ...Array.from({ length: room.speakerCount - 1 }, (_, i) => ({
      id: `speaker-${i + 1}`,
      name: `Speaker ${i + 1}`,
      isSpeaker: true,
      isMuted: Math.random() > 0.7, // Some speakers are muted
      isHost: false,
      isSpeaking: Math.random() > 0.5, // Some speakers are talking
      hasRaisedHand: false,
    })),
    // Regular participants
    ...Array.from({ length: Math.min(20, room.participantCount - room.speakerCount) }, (_, i) => ({
      id: `participant-${i + 1}`,
      name: `Listener ${i + 1}`,
      isSpeaker: false,
      isMuted: true,
      isHost: false,
      isSpeaking: false,
      hasRaisedHand: Math.random() > 0.8, // Some participants have raised hands
    })),
  ];
  
  return {
    ...room,
    participants,
  };
};

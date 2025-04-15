import React, { useState } from 'react';
import { User, MessageSquare, Phone, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import ChatModal from './ChatModal';
import FriendProfileModal from './FriendProfileModal';
import CallModal from './CallModal';
import JoinRoomModal from './JoinRoomModal';

interface Friend {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'in-room';
  avatarUrl?: string;
  roomId?: string;
  college?: string;
  university?: string;
  occupation?: string;
  hobby?: string;
}

const mockFriends: Friend[] = [
  { id: '1', name: 'Alex Johnson', status: 'online', college: 'City College', university: 'Metro University', occupation: 'Software Engineer', hobby: 'Photography' },
  { id: '2', name: 'Jamie Smith', status: 'in-room', roomId: 'room1', college: 'North College', university: 'State University', occupation: 'Designer', hobby: 'Cycling' },
  { id: '3', name: 'Taylor Rodriguez', status: 'offline', college: 'West College', university: 'Central University', occupation: 'Teacher', hobby: 'Reading' },
  { id: '4', name: 'Jordan Williams', status: 'online', college: 'South College', university: 'Tech University', occupation: 'Musician', hobby: 'Guitar' },
  { id: '5', name: 'Casey Thompson', status: 'in-room', roomId: 'room2', college: 'East College', university: 'Arts University', occupation: 'Artist', hobby: 'Painting' },
];

const FriendCard: React.FC<{ friend: Friend; onChat: (friend: Friend) => void; onViewProfile: (friend: Friend) => void; onCall: (friend: Friend) => void; onJoin: (friend: Friend) => void; onRemove: (friend: Friend) => void }> = ({ friend, onChat, onViewProfile, onCall, onJoin, onRemove }) => {
  const statusColor = {
    'online': 'bg-green-500',
    'offline': 'bg-gray-400',
    'in-room': 'bg-wave-purple',
  }[friend.status];
  
  const statusText = {
    'online': 'Online',
    'offline': 'Offline',
    'in-room': 'In a room',
  }[friend.status];

  return (
    <Card className="overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] duration-300 animate-bounce-in"
      onClick={() => onChat(friend)}
      tabIndex={0}
      role="button"
      aria-label={`Chat with ${friend.name}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={friend.avatarUrl} />
              <AvatarFallback className="bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{friend.name}</h3>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                <span className="text-xs text-muted-foreground">{statusText}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {friend.status === 'in-room' && (
              <Button size="sm" variant="outline" className="h-8" onClick={e => { e.stopPropagation(); onJoin(friend); }}>
                Join
              </Button>
            )}
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={e => { e.stopPropagation(); onChat(friend); }}>
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" disabled={friend.status === 'offline'} onClick={e => { e.stopPropagation(); onCall(friend); }}>
                <Phone className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={e => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={e => { e.stopPropagation(); onViewProfile(friend); }}>View Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={e => { e.stopPropagation(); toast({ title: 'Invitation sent', description: `You invited ${friend.name} to your room.` }); }}>Invite to Room</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={e => { e.stopPropagation(); onRemove(friend); }}>Remove Friend</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface FriendsListProps {
  searchQuery: string;
  filter: 'all' | 'in-room' | 'online';
}

const FriendsList: React.FC<FriendsListProps> = ({ searchQuery, filter: initialFilter }) => {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [filter, setFilter] = useState<'all' | 'in-room' | 'online'>(initialFilter || 'all');
  const [chatOpen, setChatOpen] = useState(false);
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileFriend, setProfileFriend] = useState<Friend | null>(null);
  const [callOpen, setCallOpen] = useState(false);
  const [callFriend, setCallFriend] = useState<Friend | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinFriend, setJoinFriend] = useState<Friend | null>(null);

  const handleChat = (friend: Friend) => {
    setActiveFriend(friend);
    setChatOpen(true);
  };
  const handleViewProfile = (friend: Friend) => {
    setProfileFriend(friend);
    setProfileOpen(true);
  };
  const handleCall = (friend: Friend) => {
    setCallFriend(friend);
    setCallOpen(true);
  };
  const handleJoin = (friend: Friend) => {
    setJoinFriend(friend);
    setJoinOpen(true);
  };
  const handleRemove = (friend: Friend) => {
    setFriends(prev => prev.filter(f => f.id !== friend.id));
    toast({ title: 'Friend removed', description: `${friend.name} has been removed from your friends.` });
  };

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'in-room' ? friend.status === 'in-room' :
      filter === 'online' ? friend.status === 'online' :
      true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Your Friends</h2>
          <Badge variant="outline">{friends.length}</Badge>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" className="min-w-[70px]" onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'online' ? 'default' : 'outline'} size="sm" className="min-w-[70px]" onClick={() => setFilter('online')}>Online</Button>
          <Button variant={filter === 'in-room' ? 'default' : 'outline'} size="sm" className="min-w-[90px]" onClick={() => setFilter('in-room')}>In Rooms</Button>
        </div>
      </div>
      {filteredFriends.length > 0 ? (
        <div className="grid gap-4">
          {filteredFriends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} onChat={handleChat} onViewProfile={handleViewProfile} onCall={handleCall} onJoin={handleJoin} onRemove={handleRemove} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-medium mb-2">No friends yet</h3>
          <p className="text-muted-foreground mb-6">
            Start adding friends to connect and join voice rooms together
          </p>
          <Button>Add Your First Friend</Button>
        </div>
      )}
      <ChatModal
        open={chatOpen}
        onOpenChange={setChatOpen}
        friendName={activeFriend?.name || ''}
        friendStatus={activeFriend?.status}
        friendId={activeFriend?.id}
      />
      <FriendProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
        friend={profileFriend}
      />
      <CallModal
        open={callOpen}
        onOpenChange={setCallOpen}
        friendName={callFriend?.name || ''}
      />
      <JoinRoomModal
        open={joinOpen}
        onOpenChange={setJoinOpen}
        friendName={joinFriend?.name || ''}
        roomId={joinFriend?.roomId}
      />
    </div>
  );
};

export default FriendsList;

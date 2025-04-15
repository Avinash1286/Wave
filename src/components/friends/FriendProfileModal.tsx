import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface FriendProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friend: {
    name: string;
    status: 'online' | 'offline' | 'in-room';
    avatarUrl?: string;
    roomId?: string;
    college?: string;
    university?: string;
    occupation?: string;
    hobby?: string;
  } | null;
}

const statusColor = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  'in-room': 'bg-wave-purple',
};
const statusText = {
  online: 'Online',
  offline: 'Offline',
  'in-room': 'In a room',
};

const FriendProfileModal: React.FC<FriendProfileModalProps> = ({ open, onOpenChange, friend }) => {
  if (!friend) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs w-full">
        <DialogHeader>
          <DialogTitle>Friend Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-2">
          <Avatar className="h-20 w-20 border border-border">
            <AvatarImage src={friend.avatarUrl} />
            <AvatarFallback className="bg-muted">
              <User className="h-8 w-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold mt-2">{friend.name}</h2>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusColor[friend.status]}`}></span>
            <span className="text-xs text-muted-foreground">{statusText[friend.status]}</span>
          </div>
          {friend.status === 'in-room' && friend.roomId && (
            <div className="mt-2 text-sm">
              Currently in Room: <span className="font-medium">{friend.roomId}</span>
            </div>
          )}
          {/* Additional info */}
          <div className="w-full mt-4 space-y-1 text-sm text-left">
            {friend.college && (
              <div><span className="font-medium">College:</span> {friend.college}</div>
            )}
            {friend.university && (
              <div><span className="font-medium">University:</span> {friend.university}</div>
            )}
            {friend.occupation && (
              <div><span className="font-medium">Occupation:</span> {friend.occupation}</div>
            )}
            {friend.hobby && (
              <div><span className="font-medium">Hobby:</span> {friend.hobby}</div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FriendProfileModal;

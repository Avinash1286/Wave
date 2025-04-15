import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MoreVertical, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import SpeakingIndicator from './SpeakingIndicator';
import { deleteRoomFromStorage } from '@/utils/localStorage';
import DeleteRoomDialog from './DeleteRoomDialog';
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

export type RoomData = {
  id: string;
  name: string;
  hostName: string;
  participantCount: number;
  speakerCount: number;
  isLive: boolean;
  imageUrl?: string;
  tags?: string[];
  description?: string;
  creatorId?: string;
};

interface RoomCardProps {
  room: RoomData;
  onDelete?: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const imageUrl = room.imageUrl || getImageForTags(room.tags);
  const currentUser = getCurrentUser();
  const canDelete = currentUser?.id === room.creatorId;
  
  const handleRoomClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the dropdown
    if ((e.target as HTMLElement).closest('.room-menu')) {
      return;
    }
    navigate(`/room/${room.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteRoomFromStorage(room.id);
    onDelete?.(room.id);
    toast.success('Room deleted successfully');
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden cursor-pointer transition-all hover:shadow-md",
          "transform hover:-translate-y-1 hover:scale-[1.02] duration-300 animate-bounce-in"
        )}
        onClick={handleRoomClick}
      >
        <CardContent className="p-0">
          {/* Room image or gradient background */}
          <div className="h-32 bg-gradient-to-r from-wave-purple/60 to-wave-vivid-purple/60 relative">
            <img 
              src={imageUrl}
              alt={room.name}
              className="w-full h-full object-cover opacity-70"
            />
            
            {/* Live indicator */}
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium text-white">LIVE</span>
              </div>
            </div>
            
            {/* Menu button - Only show for room creator */}
            {canDelete && (
              <div className="absolute top-3 right-3 room-menu">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 bg-black/30 backdrop-blur-sm hover:bg-black/40"
                    >
                      <MoreVertical className="h-4 w-4 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive" 
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Room
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Room info */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{room.name}</h3>
            
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <span>Hosted by {room.hostName}</span>
            </div>
            
            {room.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {room.description}
              </p>
            )}
            
            {room.tags && room.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {room.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{room.participantCount}</span>
              </div>
              
              {room.isLive && room.speakerCount > 0 && (
                <SpeakingIndicator />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteRoomDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        roomName={room.name}
      />
    </>
  );
};

export default RoomCard;

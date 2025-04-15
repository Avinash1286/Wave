import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface JoinRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friendName: string;
  roomId?: string;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ open, onOpenChange, friendName, roomId }) => {
  const [status, setStatus] = useState<'joining' | 'joined'>('joining');

  useEffect(() => {
    if (!open) return;
    setStatus('joining');
    const timer = setTimeout(() => setStatus('joined'), 1800);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs w-full flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>
            {status === 'joining' && `Joining ${friendName}'s Room...`}
            {status === 'joined' && `Joined ${friendName}'s Room!`}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative flex items-center justify-center">
            <Users className="h-14 w-14 text-primary animate-pulse" />
            <span className="absolute animate-ping inline-flex h-20 w-20 rounded-full bg-primary opacity-30" />
          </div>
          {status === 'joining' && <div className="text-muted-foreground">Connecting to Room...</div>}
          {status === 'joined' && (
            <div className="text-muted-foreground">You are now in <span className="font-semibold">{roomId || `${friendName}'s Room`}</span>.</div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomModal;

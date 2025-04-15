import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, XCircle } from 'lucide-react';

interface CallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friendName: string;
}

const CallModal: React.FC<CallModalProps> = ({ open, onOpenChange, friendName }) => {
  const [status, setStatus] = useState<'calling' | 'no-answer' | 'ended'>('calling');

  useEffect(() => {
    if (!open) return;
    setStatus('calling');
    // Simulate no answer after 8 seconds
    const timer = setTimeout(() => setStatus('no-answer'), 8000);
    return () => clearTimeout(timer);
  }, [open]);

  const handleEnd = () => {
    setStatus('ended');
    setTimeout(() => onOpenChange(false), 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs w-full flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle>
            {status === 'calling' && `Calling ${friendName}...`}
            {status === 'no-answer' && 'No answer'}
            {status === 'ended' && 'Call ended'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative flex items-center justify-center">
            <Phone className="h-14 w-14 text-primary animate-pulse" />
            <span className="absolute animate-ping inline-flex h-20 w-20 rounded-full bg-primary opacity-30" />
          </div>
          {status === 'calling' && <div className="text-muted-foreground">Ringing...</div>}
          {status === 'no-answer' && <div className="text-muted-foreground">{friendName} did not answer.</div>}
          {status === 'ended' && <div className="text-muted-foreground">Call ended.</div>}
        </div>
        <DialogFooter>
          {status === 'calling' && (
            <Button variant="destructive" onClick={handleEnd} className="w-full flex items-center gap-2">
              <XCircle className="h-4 w-4" /> End Call
            </Button>
          )}
          {status !== 'calling' && (
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallModal;

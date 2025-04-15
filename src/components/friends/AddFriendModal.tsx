import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AddFriendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock suggestion data
const mockSuggestions = [
  { id: '1', name: 'Sarah Parker', mutualFriends: 3, avatarUrl: '' },
  { id: '2', name: 'Mike Johnson', mutualFriends: 5, avatarUrl: '' },
  { id: '3', name: 'Emma Wilson', mutualFriends: 2, avatarUrl: '' },
  { id: '4', name: 'James Brown', mutualFriends: 4, avatarUrl: '' },
];

const AddFriendModal: React.FC<AddFriendModalProps> = ({ open, onOpenChange }) => {
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [filteredSuggestions, setFilteredSuggestions] = useState(mockSuggestions);

  useEffect(() => {
    setFilteredSuggestions(
      suggestions.filter(s => 
        s.name.toLowerCase().includes(username.toLowerCase())
      )
    );
  }, [username, suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Simulate sending friend request
    toast({
      title: 'Friend request sent',
      description: `A friend request has been sent to ${username}`,
    });
    setUsername('');
    onOpenChange(false);
  };

  const handleSuggestionClick = (suggestion: typeof mockSuggestions[0]) => {
    setUsername(suggestion.name);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Send a friend request by entering their username or select from suggestions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            {filteredSuggestions.length > 0 && (
              <div className="space-y-2">
                <Label>Suggestions</Label>
                <ScrollArea className="h-[200px] rounded-md border p-2">
                  <div className="space-y-2">
                    {filteredSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={suggestion.avatarUrl} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{suggestion.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.mutualFriends} mutual friends
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModal;

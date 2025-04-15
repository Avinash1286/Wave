import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const emojiList = ['😀', '😂', '😍', '😎', '👍', '🎉', '❤️', '😭', '😅', '🙏'];

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  friendName: string;
  friendStatus?: 'online' | 'offline' | 'in-room'; // optional
  friendId?: string; // add friendId for localStorage key
}

interface Message {
  id: string;
  sender: 'me' | 'friend';
  content: string;
  timestamp: string;
}

// Utility for localStorage
function getMessages(friendId: string): Message[] {
  const raw = localStorage.getItem(`chatMessages_${friendId}`);
  if (!raw) return [];
  try { return JSON.parse(raw) as Message[]; } catch { return []; }
}
function setMessages(friendId: string, messages: Message[]) {
  localStorage.setItem(`chatMessages_${friendId}` , JSON.stringify(messages));
}

const mockMessages: Message[] = [
  { id: '1', sender: 'friend', content: 'Hey! How are you?', timestamp: '12:30' },
  { id: '2', sender: 'me', content: 'I am good, what about you?', timestamp: '12:31' },
  { id: '3', sender: 'friend', content: 'Doing great! Want to join a room later?', timestamp: '12:32' },
];

const ChatModal: React.FC<ChatModalProps> = ({ open, onOpenChange, friendName, friendStatus, friendId }) => {
  const [messages, setMessagesState] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on open/friendId change
  useEffect(() => {
    if (open && friendId) {
      const stored = getMessages(friendId);
      setMessagesState(stored.length > 0 ? stored : mockMessages);
    }
  }, [open, friendId]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (open && friendId) {
      setMessages(friendId, messages);
    }
    // eslint-disable-next-line
  }, [messages, open, friendId]);

  useEffect(() => {
    if (open) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [open, messages]);

  useEffect(() => {
    if (!input) {
      setIsTyping(false);
      return;
    }
    setIsTyping(true);
    const timeout = setTimeout(() => setIsTyping(false), 1500);
    return () => clearTimeout(timeout);
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || !friendId) return;
    const newMsg: Message = { id: Date.now().toString(), sender: 'me', content: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessagesState(prev => [...prev, newMsg]);
    setInput('');
  };

  const handleEmojiClick = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmoji(false);
  };

  const handleDelete = (id: string) => {
    setMessagesState(prev => prev.filter(msg => msg.id !== id));
  };

  const statusColor = {
    'online': 'bg-green-500',
    'offline': 'bg-gray-400',
    'in-room': 'bg-wave-purple',
  }[friendStatus || 'offline'];
  const statusText = {
    'online': 'Online',
    'offline': 'Offline',
    'in-room': 'In a room',
  }[friendStatus || 'offline'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              Chat with {friendName}
              <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
              <span className="text-xs text-muted-foreground">{statusText}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 h-64 overflow-y-auto bg-muted rounded p-3 mb-2 scrollbar-none hide-scrollbar">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex flex-col items-end max-w-[75%] group">
                <div
                  className={`px-3 py-2 rounded-lg text-sm relative ${
                    msg.sender === 'me'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white text-black border'
                  }`}
                >
                  {msg.content}
                  {msg.sender === 'me' && (
                    <button
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete message"
                      onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-xs text-muted-foreground italic">You are typing...</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <DialogFooter>
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex w-full gap-2 items-center"
          >
            <Popover open={showEmoji} onOpenChange={setShowEmoji}>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowEmoji(v => !v)}>
                  <Smile className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-2 grid grid-cols-5 gap-1">
                {emojiList.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="text-xl hover:bg-accent rounded p-1"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              autoFocus
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button type="submit">Send</Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;

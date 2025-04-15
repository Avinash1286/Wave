import React, { useState } from 'react';
import { Plus, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import VoicePost from './VoicePost';

// Mock data for voice posts
const mockPosts = [
  {
    id: '1',
    username: 'Sarah Chen',
    userAvatar: 'https://i.pravatar.cc/150?u=sarah',
    audioUrl: '/audio/techtrend.mp3',
    caption: 'Sharing my thoughts on the latest tech trends! 🚀 #TechTalk',
    likes: 124,
    comments: 18,
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    username: 'Alex Rivera',
    userAvatar: 'https://i.pravatar.cc/150?u=alex',
    audioUrl: '/audio/musicproduction.mp3',
    caption: 'Quick update on my music project 🎵 #MusicLife',
    likes: 89,
    comments: 7,
    createdAt: '5 hours ago',
  },
];

// List of available audio files and their keywords
const audioFiles = [
  { file: '/audio/techtrend.mp3', keywords: ['tech', 'ai', 'robotics', 'future'] },
  { file: '/audio/musicproduction.mp3', keywords: ['music', 'song', 'album', 'production'] },
  { file: '/audio/crypto.mp3', keywords: ['crypto', 'bitcoin', 'blockchain'] },
  { file: '/audio/fitness.mp3', keywords: ['fitness', 'workout', 'exercise'] },
  { file: '/audio/travel.mp3', keywords: ['travel', 'trip', 'vacation'] },
  { file: '/audio/bookclub.mp3', keywords: ['book', 'reading', 'club'] },
  { file: '/audio/medetation.mp3', keywords: ['meditate', 'meditation', 'calm'] },
  { file: '/audio/startup.mp3', keywords: ['startup', 'founder', 'entrepreneur'] },
  { file: '/audio/futureofai.mp3', keywords: ['ai', 'future'] },
  { file: '/audio/updateinmusic.mp3', keywords: ['update', 'music'] },
  { file: '/audio/joincall.mp3', keywords: ['join', 'call'] },
  { file: '/audio/leavecall.mp3', keywords: ['leave', 'call'] },
  { file: '/audio/llminrobotics.mp3', keywords: ['llm', 'robotics'] },
  { file: '/audio/callgoing.mp3', keywords: ['call', 'going'] },
];

function selectRelevantAudio(caption: string): string {
  const lower = caption.toLowerCase();
  for (const audio of audioFiles) {
    if (audio.keywords.some((kw) => lower.includes(kw))) {
      return audio.file;
    }
  }
  // fallback
  return '/audio/techtrend.mp3';
}

// Add commentList to each post in state
const initialPosts = mockPosts.map(post => ({ ...post, commentList: [] }));

const VoiceFeed: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [caption, setCaption] = useState('');
  const [posts, setPosts] = useState(initialPosts);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    toast.info('Recording started...');
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast.success('Voice recorded successfully!');
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handlePost = () => {
    let url = audioUrl;
    if (!url) {
      url = selectRelevantAudio(caption);
    }
    const newPost = {
      id: String(Date.now()),
      username: 'Current User',
      userAvatar: 'https://i.pravatar.cc/150?u=currentuser',
      audioUrl: url,
      caption,
      likes: 0,
      comments: 0,
      createdAt: 'Just now',
      commentList: [],
    };
    setPosts([newPost, ...posts]);
    setCaption('');
    setAudioFile(null);
    setAudioUrl(null);
    toast.success('Post created successfully!');
  };

  // Add comment handler
  const handleAddComment = (postId: string, comment: string) => {
    setPosts(posts => posts.map(post => post.id === postId ? { ...post, commentList: [...post.commentList, comment] } : post));
  };

  // Delete post handler
  const handleDeletePost = (postId: string) => {
    setPosts(posts => posts.filter(post => post.id !== postId));
    toast.success('Post deleted');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-full mb-8 py-6 bg-background/50 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-all rounded-2xl flex items-center justify-center gap-3 text-foreground"
            variant="ghost"
          >
            <Mic className="h-5 w-5" />
            <span>Record your voice</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium text-foreground">New Voice Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex justify-center">
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className={`rounded-full h-16 w-16 ${isRecording ? 'animate-pulse' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                <Mic className="h-6 w-6" />
              </Button>
            </div>
            <Input
              className="rounded-lg"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Upload audio file (optional):</label>
              <Input type="file" accept="audio/*" onChange={handleAudioUpload} />
            </div>
            <Button
              className="w-full"
              onClick={handlePost}
              disabled={!isRecording && !caption && !audioFile}
            >
              Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id}>
            <VoicePost
              {...post}
              commentList={post.commentList}
              onAddComment={handleAddComment}
              onDelete={handleDeletePost}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceFeed;
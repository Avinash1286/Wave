import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle, PauseCircle, Heart, MessageCircle, Share2, MoreHorizontal, Clock, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import SpeakingIndicator from '../rooms/SpeakingIndicator';
import { Progress } from '@/components/ui/progress';
import WaveSurfer from 'wavesurfer.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface VoicePostProps {
  id: string;
  username: string;
  userAvatar?: string;
  audioUrl: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
  commentList: string[];
  onAddComment: (postId: string, comment: string) => void;
  onDelete: (postId: string) => void;
}

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

function selectRelevantAudio(caption: string, fallback: string): string {
  const lower = caption.toLowerCase();
  for (const audio of audioFiles) {
    if (audio.keywords.some((kw) => lower.includes(kw))) {
      return audio.file;
    }
  }
  return fallback;
}

const VoicePost: React.FC<VoicePostProps> = ({
  id,
  username,
  userAvatar,
  audioUrl,
  caption,
  likes,
  comments,
  createdAt,
  commentList,
  onAddComment,
  onDelete,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState(audioUrl);
  const [commentInput, setCommentInput] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    // If audioUrl is a blob (uploaded), use as is, else select relevant audio
    if (audioUrl.startsWith('blob:') || audioUrl.startsWith('http')) {
      setResolvedAudioUrl(audioUrl);
    } else {
      setResolvedAudioUrl(selectRelevantAudio(caption, audioUrl));
    }
  }, [audioUrl, caption]);

  useEffect(() => {
    let wavesurfer: WaveSurfer | null = null;

    const initializeWaveSurfer = async () => {
      if (waveformRef.current && resolvedAudioUrl) {
        wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: '#9ca3af',
          progressColor: '#7c3aed',
          cursorColor: '#7c3aed',
          barWidth: 2,
          barGap: 3,
          height: 40,
          normalize: true,
          url: resolvedAudioUrl,
        });

        wavesurfer.on('ready', () => {
          wavesurferRef.current = wavesurfer;
          setDuration(wavesurfer?.getDuration() || 0);
        });

        wavesurfer.on('play', () => setIsPlaying(true));
        wavesurfer.on('pause', () => setIsPlaying(false));
        wavesurfer.on('audioprocess', (currentTime: number) => {
          setCurrentTime(currentTime);
          const progress = (currentTime / wavesurfer.getDuration()) * 100;
          setProgress(progress);
        });
      }
    };

    initializeWaveSurfer();

    // Remove intersection observer for auto-play
    return () => {
      wavesurfer?.destroy();
    };
  }, [resolvedAudioUrl]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Post unliked' : 'Post liked');
  };

  const handleComment = () => {
    toast.info('Comments feature coming soon!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://voicewave.app/post/${id}`);
    toast.success('Link copied to clipboard!');
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-border" ref={containerRef}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} />
            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">{username}</h3>
                <p className="text-xs text-muted-foreground">{createdAt}</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your post and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {caption && <p className="text-sm text-foreground/90">{caption}</p>}

            <div className="bg-card rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <PauseCircle className="h-8 w-8 text-foreground" />
                  ) : (
                    <PlayCircle className="h-8 w-8 text-foreground" />
                  )}
                </Button>
                <div className="flex-1">
                  <div ref={waveformRef}></div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Comments ({commentList.length})</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCommenting(!isCommenting)}
                  className="text-xs"
                >
                  {isCommenting ? 'Cancel' : 'Add Comment'}
                </Button>
              </div> */}

              {isCommenting && (
                <form 
                  className="space-y-2"
                  onSubmit={e => {
                    e.preventDefault();
                    if (commentInput.trim()) {
                      onAddComment(id, commentInput);
                      setCommentInput('');
                      setIsCommenting(false);
                    }
                  }}
                >
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    className="resize-none bg-background/50 backdrop-blur-sm border-border"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsCommenting(false);
                        setCommentInput('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!commentInput.trim()}
                    >
                      Post
                    </Button>
                  </div>
                </form>
              )}

              {commentList.length > 0 && (
                <div className="space-y-2 mt-2">
                  {commentList.map((comment, i) => (
                    <div key={i} className="bg-muted/30 backdrop-blur-sm rounded-lg p-3 text-sm">
                      <p className="text-foreground/90">{comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-3" />

            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 mr-1.5 ${liked ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} />
                <span className="text-sm text-foreground">{likes + (liked ? 1 : 0)}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setIsCommenting(true)}
              >
                <MessageCircle className="h-4 w-4 mr-1.5 text-foreground" />
                <span className="text-sm text-foreground">{commentList.length}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 ml-auto"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 text-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoicePost;
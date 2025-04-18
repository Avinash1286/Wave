import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { getCurrentUser } from '@/utils/auth';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string()
    .min(3, { message: 'Room name must be at least 3 characters' })
    .max(50, { message: 'Room name must be at most 50 characters' }),
  description: z.string().max(300, { message: 'Description must be at most 300 characters' }).optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomCreated: (roomData: any) => void;
}

const CreateRoomDialog: React.FC<CreateRoomDialogProps> = ({ 
  open, 
  onOpenChange,
  onRoomCreated
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      tags: ''
    }
  });

  const [coverImage, setCoverImage] = React.useState<string | undefined>(undefined);
  const [coverPreview, setCoverPreview] = React.useState<string | undefined>(undefined);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: FormValues) => {
    const currentUser = getCurrentUser();
    // Generate a new room object
    const newRoom = {
      id: crypto.randomUUID(),
      name: values.name,
      description: values.description || '',
      hostName: currentUser?.username || 'You',
      participantCount: 4, // 1 host + 1 speaker + 2 listeners
      speakerCount: 2, // host + 1 dummy speaker
      isLive: true,
      createdAt: new Date().toISOString(),
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      creatorId: currentUser?.id,
      imageUrl: coverImage, // Add cover image to room object
      // Add participants array for demo/testing
      participants: [
        {
          id: currentUser?.id || 'host',
          name: currentUser?.username || 'You',
          imageUrl: currentUser?.avatarUrl,
          isSpeaker: true,
          isMuted: false,
          isHost: true,
          isSpeaking: false,
          hasRaisedHand: false,
        },
        {
          id: 'dummy-speaker',
          name: 'Demo Speaker',
          imageUrl: undefined,
          isSpeaker: true,
          isMuted: false,
          isHost: false,
          isSpeaking: false,
          hasRaisedHand: false,
        },
        {
          id: 'dummy-listener-1',
          name: 'Demo Listener 1',
          imageUrl: undefined,
          isSpeaker: false,
          isMuted: true,
          isHost: false,
          isSpeaking: false,
          hasRaisedHand: false,
        },
        {
          id: 'dummy-listener-2',
          name: 'Demo Listener 2',
          imageUrl: undefined,
          isSpeaker: false,
          isMuted: true,
          isHost: false,
          isSpeaking: false,
          hasRaisedHand: false,
        },
      ],
    };

    onRoomCreated(newRoom);
    form.reset();
    setCoverImage(undefined);
    setCoverPreview(undefined);
    onOpenChange(false);
    toast.success('Room created successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Room</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My awesome room..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell people what this room is about..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="music, technology, news (separated by commas)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover image upload */}
            <div>
              <FormLabel>Cover Image (optional)</FormLabel>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {coverPreview && (
                <img src={coverPreview} alt="Cover Preview" className="mt-2 w-full max-h-40 object-cover rounded" />
              )}
            </div>

            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create Room</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;

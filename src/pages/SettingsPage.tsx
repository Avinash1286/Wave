import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { getCurrentUser } from '@/utils/auth';

const SettingsPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const [formData, setFormData] = useState({
    displayName: currentUser?.username || '',
    email: currentUser?.email || '',
    inputDevice: 'Default Microphone',
    outputDevice: 'Default Speaker',
    notifications: {
      friendRequests: true,
      roomInvites: true,
      friendActivity: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleNotificationChange = (id: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [id]: checked
      }
    }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to your backend/localStorage
    toast.success("Settings saved successfully!");
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <form onSubmit={handleSaveSettings}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and how others see you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="Your display name"
                    value={formData.displayName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    placeholder="Tell us a bit about yourself"
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Audio Settings</CardTitle>
                <CardDescription>
                  Configure your microphone and speaker settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inputDevice">Input Device</Label>
                  <Input
                    id="inputDevice"
                    placeholder="Default Microphone"
                    value={formData.inputDevice}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outputDevice">Output Device</Label>
                  <Input
                    id="outputDevice"
                    placeholder="Default Speaker"
                    value={formData.outputDevice}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="friendRequestNotif">Friend Requests</Label>
                  <Switch 
                    id="friendRequestNotif" 
                    checked={formData.notifications.friendRequests}
                    onCheckedChange={(checked) => handleNotificationChange('friendRequests', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="roomInviteNotif">Room Invitations</Label>
                  <Switch 
                    id="roomInviteNotif" 
                    checked={formData.notifications.roomInvites}
                    onCheckedChange={(checked) => handleNotificationChange('roomInvites', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="friendActivityNotif">Friend Activity</Label>
                  <Switch 
                    id="friendActivityNotif" 
                    checked={formData.notifications.friendActivity}
                    onCheckedChange={(checked) => handleNotificationChange('friendActivity', checked)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <CardFooter className="flex justify-end">
              <Button type="submit" className="gap-1">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </CardFooter>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default SettingsPage;


import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">About Wave</h1>
          <p className="text-muted-foreground">
            Learn more about our platform and how it works.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>
              Connecting people through the power of voice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Wave is a voice-based social platform that enables real-time audio conversations in virtual rooms. 
              Our mission is to create a space where people can connect through authentic conversations, share ideas, 
              and build communities around shared interests.
            </p>
            <p>
              We believe that voice adds a human dimension to online interactions that text alone cannot provide. 
              By focusing on live audio, we're fostering deeper connections and more engaging discussions.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Create or Join Rooms</h3>
              <p className="text-muted-foreground">
                Browse existing conversation rooms or create your own room around a topic you're passionate about.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Real-time Conversations</h3>
              <p className="text-muted-foreground">
                Participate in live discussions where speakers can share their thoughts and listeners can react and request to speak.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Connect with Friends</h3>
              <p className="text-muted-foreground">
                Build your network by adding friends and inviting them to your rooms for more intimate conversations.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Connect With Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <Button variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                <span>Contact Us</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>© 2025 VoiceWave. All rights reserved.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;

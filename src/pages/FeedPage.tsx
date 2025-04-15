import React from 'react';
import Layout from '@/components/layout/Layout';
import VoiceFeed from '@/components/feed/VoiceFeed';

const FeedPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Voice Feed</h1>
          <p className="text-muted-foreground">
            Share and discover voice posts from the community.
          </p>
        </div>
        
        <VoiceFeed />
      </div>
    </Layout>
  );
};

export default FeedPage;
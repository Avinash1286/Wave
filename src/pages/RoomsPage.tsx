
import React from 'react';
import Layout from '@/components/layout/Layout';
import RoomsList from '@/components/rooms/RoomsList';

const RoomsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Voice Rooms</h1>
          <p className="text-muted-foreground">
            Browse and join live voice conversations happening right now.
          </p>
        </div>
        
        <RoomsList />
      </div>
    </Layout>
  );
};

export default RoomsPage;

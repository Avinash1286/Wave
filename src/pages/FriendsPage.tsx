import React, { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FriendsList from '@/components/friends/FriendsList';
import AddFriendModal from '@/components/friends/AddFriendModal';

type FilterType = 'all' | 'in-room' | 'online';

const FriendsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [addFriendOpen, setAddFriendOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Friends</h1>
          <p className="text-muted-foreground">
            Connect with friends and invite them to your voice rooms.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                className="pl-9"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <Button className="gap-1 w-full sm:w-auto" onClick={() => setAddFriendOpen(true)}>
              <UserPlus className="h-4 w-4" />
              <span>Add Friend</span>
            </Button>
          </div>
        </div>
        
        <FriendsList searchQuery={searchQuery} filter={activeFilter} />
        <AddFriendModal open={addFriendOpen} onOpenChange={setAddFriendOpen} />
      </div>
    </Layout>
  );
};

export default FriendsPage;

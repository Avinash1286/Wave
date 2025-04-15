import React, { useState, useEffect } from 'react';
import RoomCard, { RoomData } from './RoomCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  initializeLocalStorage, 
  getRoomsFromStorage, 
  addRoomToStorage,
  ExtendedRoomData
} from '@/utils/localStorage';
import CreateRoomDialog from './CreateRoomDialog';

const RoomsList: React.FC = () => {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  
  useEffect(() => {
    // Initialize local storage on component mount
    initializeLocalStorage();
    
    // Fetch rooms from local storage
    const fetchRooms = async () => {
      setIsLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const storedRooms = getRoomsFromStorage();
        setRooms(storedRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error('Failed to load rooms');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  const handleCreateRoom = (roomData: ExtendedRoomData) => {
    addRoomToStorage(roomData);
    setRooms(prevRooms => [roomData, ...prevRooms]);
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
  };
  
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 className="text-2xl font-bold">Live Rooms</h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button className="gap-1" onClick={() => setIsCreateRoomOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            <span>Create Room</span>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-md bg-muted"></div>
          ))}
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onDelete={handleDeleteRoom}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-medium mb-2">No rooms found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? `No rooms match your search for "${searchQuery}"`
              : "There are no active rooms at the moment"}
          </p>
          <Button onClick={() => setIsCreateRoomOpen(true)}>Create a Room</Button>
        </div>
      )}

      <CreateRoomDialog 
        open={isCreateRoomOpen}
        onOpenChange={setIsCreateRoomOpen}
        onRoomCreated={handleCreateRoom}
      />
    </div>
  );
};

export default RoomsList;

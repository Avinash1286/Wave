import { RoomData } from '@/components/rooms/RoomCard';
import { mockRooms } from '@/data/mockData';
import { Participant } from '@/components/rooms/ParticipantAvatar';

const ROOMS_STORAGE_KEY = 'voicewave_rooms';

// Type definition for extended room data
export interface ExtendedRoomData extends RoomData {
  description?: string;
  createdAt: string;
  participants: Participant[];
}

// Initialize local storage with mock data if empty
export const initializeLocalStorage = (): void => {
  const existingRooms = localStorage.getItem(ROOMS_STORAGE_KEY);
  
  if (!existingRooms) {
    // Convert mock rooms to extended format with timestamps
    const initialRooms = mockRooms.map(room => ({
      ...room,
      createdAt: new Date().toISOString(),
    }));
    
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(initialRooms));
  }
};

// Get all rooms from local storage
export const getRoomsFromStorage = (): ExtendedRoomData[] => {
  try {
    const roomsData = localStorage.getItem(ROOMS_STORAGE_KEY);
    return roomsData ? JSON.parse(roomsData) : [];
  } catch (error) {
    console.error('Error getting rooms from storage:', error);
    return [];
  }
};

// Add a new room to local storage
export const addRoomToStorage = (room: ExtendedRoomData): void => {
  try {
    const existingRooms = getRoomsFromStorage();
    const updatedRooms = [room, ...existingRooms];
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(updatedRooms));
  } catch (error) {
    console.error('Error adding room to storage:', error);
  }
};

// Delete a room from local storage
export const deleteRoomFromStorage = (roomId: string): void => {
  try {
    const existingRooms = getRoomsFromStorage();
    const updatedRooms = existingRooms.filter(room => room.id !== roomId);
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(updatedRooms));
  } catch (error) {
    console.error('Error deleting room from storage:', error);
  }
};

// Update a room in local storage
export const updateRoomInStorage = (updatedRoom: ExtendedRoomData): void => {
  try {
    const existingRooms = getRoomsFromStorage();
    const updatedRooms = existingRooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    );
    localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(updatedRooms));
  } catch (error) {
    console.error('Error updating room in storage:', error);
  }
};

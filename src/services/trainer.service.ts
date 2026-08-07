import { publicClient } from '../services/apiClients';

export const trainerProfile = async () => {
      try {
            const response = await publicClient.get('trainers/profile');
            console.log("Trainer profile response:", response.data);
            return response.data;
      } catch (error) {
            console.log("Trainer profile error:", error);
            throw error;
      }
}
import { privateClient, publicClient } from '../services/apiClients';

export const trainerProfile = async () => {
      try {
            const response = await privateClient.get('trainers/profile');
            console.log("Trainer profile response:", response.data);
            return response.data;
      } catch (error) {
            console.log("Trainer profile error:", error);
            throw error;
      }
}

export const getClients = async () => {
      try {
            const response = await privateClient.get('trainers/clients');
            console.log('Clients data fetched successfuly:', response);
            return response.data;
      } catch (error) {
            console.log('Error in getting clients data', error);
            throw error;
      }
}
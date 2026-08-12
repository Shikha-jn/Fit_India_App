import { publicClient } from '../../../services/apiClients';

export const trainerRegister = async (register: any) => {
      try {
            const response = await publicClient.post('trainers/register', register);
            console.log('New Trainer created:', response.data);
            return response.data;
      } catch (error) {
            console.log('Error in register trainer', error);
            throw error;
      }
}

export const clientRegister = async (register: any) => {
      try {
            const response = await publicClient.post('clients/register', register);
            console.log('New client created:', response.data);
            return response.data;
      } catch (error) {
            console.log('Error in creating client', error);
            throw error;
      }
}
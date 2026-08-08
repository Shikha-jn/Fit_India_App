import { publicClient } from '../../../services/apiClients';

type LoginCredentials = {
      email: string;
      password: string;
};

export const trainerLogin = async (
      credentials: LoginCredentials
) => {
      try {
            const response = await publicClient.post('trainers/login', credentials);
            console.log("Trainer login response:", response.data);
            return response.data;
      } catch (error) {
            console.log("Trainer login error:", error);
            throw error;
      }
};

export const userLogin = async (
      credentials: LoginCredentials
) => {
      try {
            const response = await publicClient.post('clients/login', credentials);
            console.log("User login response:", response.data);
            return response.data;
      } catch (error) {
            console.log("User login error:", error);
            throw error;
      }
};
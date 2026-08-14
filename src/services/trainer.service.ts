import { privateClient, publicClient } from '../services/apiClients';
import { Webinar } from '../features/webinar/types/webinar';

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

export const scheduleWebinar = async (webinar: any) => {
      try {
            const response = await privateClient.post('webinars', webinar);
            console.log('Webinar created successfuly:', response);
            return response.data;
      } catch (error) {
            console.log('Error in creating webinar', error);
            throw error;
      }
}

export const editWebinar = async (webinar: Webinar) => {
      try {
            const response = await privateClient.put(`webinars/${webinar._id}`, webinar);
            console.log('Webinar updated successfuly:', response);
            return response.data;
      } catch (error) {
            console.log('Error in updating webinar', error);
            throw error;
      }
}

export const cancelWebinar = async (webinar: Webinar) => {
      try {
            const response = await privateClient.put(`webinars/${webinar._id}`);
            console.log('Webinar cancel successfuly:', response);
            return response.data;
      } catch (error) {
            console.log('Error in canceling webinar', error);
            throw error;
      }
}

export const getClientProgress = async (id: string) => {
      try {
            const response = await privateClient.get(`trainers/clients/${id}/progress`);
            console.log('Client progress:', response);
            return response.data;
      } catch (error) {
            console.log('Error in fetching client progress:', error);
            throw error;
      }
}

export const editWorkoutPlan = async (id: string, workout: string[]) => {
      try {
            const response = await privateClient.put(`trainers/clients/${id}/workout`, workout);
            console.log('Workout edited:', response);
            return response.data;
      } catch (error) {
            console.log('Error in editing worout plan');
            throw error;
      }
}

export const editDietPlan = async (id: string, diet: string[]) => {
      try {
            const response = await privateClient.put(`trainers/clients/${id}/diet`, diet);
            console.log('Diet plan edited:', response);
            return response.data;
      } catch (error) {
            console.log('Error in editing diet plan');
            throw error;
      }
}

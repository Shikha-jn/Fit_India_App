import { publicClient } from '../services/apiClients';

export const liveWebinar = async () => {
      try {
            const response = await publicClient.get('webinars');
            console.log('Live webinars data:', response);
            return response.data;
      } catch (error) {
            console.log('Error in fetching live webinars:', error);
            throw error;
      }
}
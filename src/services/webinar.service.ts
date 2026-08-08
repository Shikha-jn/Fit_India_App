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

export const liveZoomLinks = async () => {
      try {
            const response = await publicClient.get('zoom-links');
            console.log('Live zoom links:', response);
            return response.data;
      } catch (error) {
            console.log('Error in getting live zoom links');
            throw error;
      }
}
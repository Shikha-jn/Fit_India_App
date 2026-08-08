import { privateClient } from "./apiClients";

export const getClientProfile = async () => {
      try {
            const response = await privateClient.get('clients/profile');
            console.log('Client profile:', response);
            return response.data;
      } catch (error) {
            console.log('Error in fetching client prifile:', error);
            throw error;
      }
}

export const markAttendance = async () => {
      try {
            const response = await privateClient.post('clients/attendance');
            console.log('Attendance marked:', response);
            return response.data;
      } catch (error) {
            console.log('Error in marking attendance:', error);
            throw error;
      }
}

export const paymentHistory = async () => {
      try {
            const response = await privateClient.get('payments/history');
            console.log('Client payment history:', response);
            return response.data;
      } catch (error) {
            console.log('Error in getting payment history:', error);
            throw error;
      }
}

export const getSubscription = async () => {
      try {
            const response = await privateClient.get('subscription-plans');
            console.log('Client subscriptions:', response);
            return response.data;
      } catch (error) {
            console.log('Error in getting subscriptions plans:', error);
            throw error;
      }
}
import { privateClient, publicClient } from "./apiClients";
import { Contact } from "../features/contact/types/contact";

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

export const getHealthRecord = async () => {
      try {
            const response = await privateClient.get('clients/progress');
            console.log('Clients health records:', response);
            return response.data;
      } catch (error) {
            console.log('Error in getting health records:', error);
            throw error;
      }
}

export const addHealthRecord = async (healthRecord: any) => {
      try {
            const response = await privateClient.post('clients/progress', healthRecord);
            console.log('New health record:', response);
            return response.data;
      } catch (error) {
            console.log('Error in adding health record', error);
            throw error;
      }
}

export const verifyPayment = async (id: string, payload: any) => {
      try {
            const response = await privateClient.post(`webinars/${id}/payment/verify`, payload);
            console.log('Verification done,', response);
            return response.data;
      } catch (error) {
            console.log('Error in payment verification', error);
            throw error;
      }
}

export const editProfile = async (profile: any) => {
      try {
            const response = await privateClient.put('clients/profile', profile);
            console.log('User profile updated:', response);
            return response.data;
      } catch (error) {
            console.log('Error in updating user profile:', error);
            throw error;
      }
}

export const createInquiry = async (inquiry: Contact) => {
      try {
            const response = await publicClient.post('clients/contact-inquiries', inquiry);
            console.log('Inquiry created:', response);
            return response.data;
      } catch (error) {
            console.log('Error in inquiry:', error);
            throw error;
      }
}

export const getRecordedSessions = async () => {
      try {
            const response = await privateClient.get('/recorded-meetings');
            console.log('recored mettings:', response);
            return response.data;
      } catch (error) {
            console.log('Error in getting recorded meetings', error);
            throw error;
      }
}
import { UserData } from "../profile/types/user";
import { Trainer } from "../profile/types/trainer";
// import requestNotificationPermission from "@/utils/requestNotificationPermission";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

// import { IRegisterDevice, registerDevice } from "@/features/notification/service/notification.service";
// import { DeviceConfig } from "@/config/deviceConfig";

type AuthState = {
      isAuthenticated: boolean;
      token: string | null;
      loggedInRole: 'client' | 'trainer' | null;
      user: UserData | Trainer | null;
      setAuth: (user: UserData | Trainer, role: 'client' | 'trainer', token: string) => void;
      removeAuth: () => void;
      loadAuth: () => void;
};

const STORAGE_KEY = 'auth';

export const useAuthStore = create<AuthState>((set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      loggedInRole: null,
      setAuth: async (user: UserData | Trainer, role: 'client' | 'trainer', token: string) => {

            try {
                  if (!user || !token) {
                        console.error('AUTH DATA MISSING ');
                        return;
                  }

                  const data = JSON.stringify({ user, token, role });

                  await AsyncStorage.setItem(STORAGE_KEY, data);

                  set({
                        isAuthenticated: true,
                        user: user,
                        token: token,
                        loggedInRole: role
                  })

                  // const hasPermission = await requestNotificationPermission();

                  // if (hasPermission) {
                  //       const fcmToken = await messaging().getToken();

                  //       const registerDeviceData: IRegisterDevice = {
                  //             token: fcmToken,
                  //             deviceType: 'android',
                  //             platform: 'app',
                  //             appVersion: DeviceConfig.version,
                  //       }

                  //       await registerDevice(registerDeviceData);
                  // }

            } catch (error: any) {
                  console.error('ERROR WHILE SAVING AUTH : ', error);
            }
      },
      removeAuth: async () => {
            try {

                  await AsyncStorage.removeItem(STORAGE_KEY);

                  set({
                        isAuthenticated: false,
                        user: null,
                        token: null
                  })
            } catch (error: any) {
                  console.error('ERROW WHILE REMOVING AUTH : ', error);
            }
      },
      loadAuth: async () => {
            try {

                  const data = await AsyncStorage.getItem(STORAGE_KEY);

                  if (data) {
                        const auth = JSON.parse(data);

                        set({
                              isAuthenticated: true,
                              user: auth?.user,
                              token: auth?.token,
                              loggedInRole: auth?.role
                        })
                  } else {
                        console.warn('NO USER DATA FOUND.')
                  }
            } catch (error: any) {
                  console.error('ERROR WHILE LOADING AUTH : ', error);
            }
      },
}))
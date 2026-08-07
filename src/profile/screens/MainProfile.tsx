import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from '../../types/MainTabParamList';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from '../../types/RootStackParamList';
import { useAlert } from '../../context/AlertContext';

type ProfileScreenProp = CompositeNavigationProp<
      BottomTabNavigationProp<MainTabParamList, 'Profile'>,
      NativeStackNavigationProp<RootStackParamList>
>;

export const ProfileScreen = () => {
      const navigation = useNavigation<ProfileScreenProp>();
      const alert = useAlert();
      useEffect(() => {
            alert.show({
                  title: 'Login Required',
                  message: 'Please login to continue.',
                  buttons: [
                        { label: 'No', style: 'secondary', onPress: () => { navigation.navigate('Home') } },
                        {
                              label: 'Yes, Login',
                              style: 'danger',
                              onPress: () => {
                                    alert.dismiss();
                                    navigation.navigate('Login');
                              },
                        },
                  ],
            });
            // navigation.navigate('Login');
      }, []);

      return (
            <View
                  style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                  }}
            >
                  <Text>Profile Screen</Text>
            </View>
      );
};
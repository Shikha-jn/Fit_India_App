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
            alert.warning(
                  "Login Required",
                  "Please login to continue.",
            );
            navigation.navigate('Login');
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
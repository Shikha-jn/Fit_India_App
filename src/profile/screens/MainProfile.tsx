import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from '../../types/MainTabParamList';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from '../../types/RootStackParamList';

type ProfileScreenProp = CompositeNavigationProp<
      BottomTabNavigationProp<MainTabParamList, 'Profile'>,
      NativeStackNavigationProp<RootStackParamList>
>;

export const ProfileScreen = () => {
      const navigation = useNavigation<ProfileScreenProp>();
      useEffect(() => {
            Alert.alert(
                  "Login Required",
                  "Please login to continue.",
                  [
                        {
                              text: "OK",
                              onPress: () => navigation.replace('Login'),
                        },
                  ],
                  {
                        cancelable: false,
                  }
            );
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
import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { NativeBottomTabScreenProps } from '@react-navigation/bottom-tabs/unstable';
import { MainTabParamList } from '../../types/MainTabParamList';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { CompositeScreenProps, } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';
import { useAlert } from '../../context/AlertContext';

type ProfileScreenProp = CompositeScreenProps<
      NativeBottomTabScreenProps<MainTabParamList, 'Profile'>,
      NativeStackScreenProps<RootStackParamList>
>;

export const ProfileScreen = ({ navigation }: ProfileScreenProp) => {
      // const navigation = useNavigation<ProfileScreenProp>();
      const alert = useAlert();
      useEffect(() => {
            alert.show({
                  title: 'Login Required',
                  message: 'Please login to continue.',
                  type: 'confirm',
                  buttons: [
                        { label: 'No', style: 'secondary', onPress: () => { navigation.navigate('Home') } },
                        {
                              label: 'Yes, Login',
                              style: 'primary',
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
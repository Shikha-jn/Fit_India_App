import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './MainTabNavigator';
import UserTabNavigator from './UserTabNavigator';
import TrainerTabNavigator from './TrainerTabNavigator';
import { RootStackParamList } from '../types/RootStackParamList';
import LoginScreen from '../auth/login/screens/LoginScreen';
import RegisterScreen from '../auth/register/screens/RegisterScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
      return (
            <NavigationContainer>
                  <Stack.Navigator
                        // initialRouteName="Splash"
                        screenOptions={{
                              headerShown: false,
                              statusBarStyle: 'light',
                        }}
                  >
                        {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
                        <Stack.Screen name="MainTab" component={MainTabNavigator} />
                        <Stack.Screen name="UserTab" component={UserTabNavigator} />
                        <Stack.Screen name="TrainerTab" component={TrainerTabNavigator} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                  </Stack.Navigator>
            </NavigationContainer>
      );
}
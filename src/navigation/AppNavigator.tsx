import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MainTabNavigator from './MainTabNavigator';
import UserTabNavigator from './UserTabNavigator';
import TrainerTabNavigator from './TrainerTabNavigator';
import { RootStackParamList } from '../types/RootStackParamList';
import LoginScreen from '../auth/login/screens/LoginScreen';
import RegisterScreen from '../auth/register/screens/RegisterScreen';
import AttendanceScreen from '../features/attendance/screens/AttendanceScreen';
import SubscriptionScreen from '../features/subscription/screens/Subscription';
import ScheduleWebinarScreen from '../features/webinar/screens/AddWebinarScreen';
import SplashScreen from '../screens/SplashScreen';
import ClientDetailScreen from '../features/clientDirectory/screens/ClientDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
      return (
            <NavigationContainer>
                  <Stack.Navigator
                        initialRouteName="Splash"
                        screenOptions={{
                              headerShown: false,
                              statusBarStyle: 'light',
                        }}
                  >
                        <Stack.Screen name="Splash" component={SplashScreen} />
                        <Stack.Screen name="MainTab" component={MainTabNavigator} />
                        <Stack.Screen name="UserTab" component={UserTabNavigator} />
                        <Stack.Screen name="TrainerTab" component={TrainerTabNavigator} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="Attendance" component={AttendanceScreen} />
                        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
                        <Stack.Screen name='ScheduleWebinar' component={ScheduleWebinarScreen} />
                        <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
                  </Stack.Navigator>
            </NavigationContainer>
      );
}
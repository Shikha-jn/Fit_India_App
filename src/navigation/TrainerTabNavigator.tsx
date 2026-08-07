import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TrainerTabParamList } from '../types/TrainerTabParamList';
import { TrainerDashboard } from '../features/dashboard/TrainerDashboard';
import HomeScreen from '../features/dashboard/HomeScreen';

const TrainerTabStack = createBottomTabNavigator<TrainerTabParamList>();

export default function TrainerTabNavigator() {
      return (
            <TrainerTabStack.Navigator
                  screenOptions={{
                        headerShown: false,
                  }}
            >
                  <TrainerTabStack.Screen name="Dashboard" component={TrainerDashboard} options={{ tabBarLabel: 'Dashboard' }} />
                  <TrainerTabStack.Screen name="ClientDirectory" component={TrainerDashboard} options={{ tabBarLabel: 'Client Directory' }} />
                  <TrainerTabStack.Screen name="Webinar" component={TrainerDashboard} options={{ tabBarLabel: 'Webinar' }} />
                  <TrainerTabStack.Screen name="Profile" component={TrainerDashboard} options={{ tabBarLabel: 'Profile' }} />
            </TrainerTabStack.Navigator>
      );
}
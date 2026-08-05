import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TrainerTabParamList } from '../types/TrainerTabParamList';
import { HomeScreen } from '../features/dashboard/HomeScreen';

const TrainerTabStack = createBottomTabNavigator<TrainerTabParamList>();

export default function TrainerTabNavigator() {
      return (
            <TrainerTabStack.Navigator
                  screenOptions={{
                        headerShown: false,
                  }}
            >
                  <TrainerTabStack.Screen name="Dashboard" component={HomeScreen} options={{ tabBarLabel: 'Dashboard' }} />
                  <TrainerTabStack.Screen name="ClientDirectory" component={HomeScreen} options={{ tabBarLabel: 'Client Directory' }} />
                  <TrainerTabStack.Screen name="Webinar" component={HomeScreen} options={{ tabBarLabel: 'Webinar' }} />
                  <TrainerTabStack.Screen name="Profile" component={HomeScreen} options={{ tabBarLabel: 'Profile' }} />
            </TrainerTabStack.Navigator>
      );
}
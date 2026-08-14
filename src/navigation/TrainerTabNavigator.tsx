import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TrainerTabParamList } from '../types/TrainerTabParamList';
import { TrainerDashboard } from '../features/dashboard/TrainerDashboard';
import ClientDirectoryScreen from '../features/clientDirectory/screens/ClientDirectoryScreen'
import WebinarScreen from '../features/webinar/screens/TrainerWebinar';
import CustomTabBar from '../components/customTabBar';

const TrainerTabStack = createBottomTabNavigator<TrainerTabParamList>();

export default function TrainerTabNavigator() {
      return (
            <TrainerTabStack.Navigator
                  screenOptions={{
                        headerShown: false,
                  }}
                  tabBar={(props) => <CustomTabBar {...props} />}
            >
                  <TrainerTabStack.Screen name="Dashboard" component={TrainerDashboard} options={{ tabBarLabel: 'Dashboard' }} />
                  <TrainerTabStack.Screen name="ClientDirectory" component={ClientDirectoryScreen} options={{ tabBarLabel: 'Client Directory' }} />
                  <TrainerTabStack.Screen name="Webinar" component={WebinarScreen} options={{ tabBarLabel: 'Webinar' }} />
                  {/* <TrainerTabStack.Screen name="Profile" component={TrainerDashboard} options={{ tabBarLabel: 'Profile' }} /> */}
            </TrainerTabStack.Navigator>
      );
}
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/MainTabParamList';
import HomeScreen from '../features/dashboard/HomeScreen';
import CustomTabBar from '../components/customTabBar';
import WebinarScreen from '../features/webinar/screens/LiveWebinar';
import ServicesScreen from '../features/services/screens/ServiceScreen';

const MainTabStack = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
      return (
            <MainTabStack.Navigator
                  screenOptions={{
                        headerShown: false,
                  }}
                  tabBar={(props) => <CustomTabBar {...props} />}
            >
                  <MainTabStack.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
                  <MainTabStack.Screen name="Services" component={ServicesScreen} options={{ tabBarLabel: 'Services' }} />
                  <MainTabStack.Screen name="Webinar" component={WebinarScreen} options={{ tabBarLabel: 'Webinar' }} />
            </MainTabStack.Navigator>
      );
}
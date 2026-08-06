import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/MainTabParamList';
import { HomeScreen } from '../features/dashboard/HomeScreen';
import CustomTabBar from '../components/customTabBar';
import { ProfileScreen } from '../profile/screens/MainProfile';

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
                  <MainTabStack.Screen name="Services" component={HomeScreen} options={{ tabBarLabel: 'Services' }} />
                  <MainTabStack.Screen name="Webinar" component={HomeScreen} options={{ tabBarLabel: 'Webinar' }} />
                  <MainTabStack.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
            </MainTabStack.Navigator>
      );
}
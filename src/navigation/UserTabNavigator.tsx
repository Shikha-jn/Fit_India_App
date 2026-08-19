import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserTabParamList } from '../types/UserTabParamList';
import UserDashboard from '../features/dashboard/UserDashboard';
import HealthRecordScreen from '../features/healthTrack/screens/HealthRecord';
import CustomTabBar from '../components/customTabBar';
import WebinarScreen from '../features/webinar/screens/LiveWebinar';
import UserProfileScreen from '../profile/screens/UserProfile';
import WebinarTabScreen from '../features/webinar/screens/UserWebinar';

const UserTabStack = createBottomTabNavigator<UserTabParamList>();

export default function UserTabNavigator() {
      return (
            <UserTabStack.Navigator
                  screenOptions={{
                        headerShown: false,
                  }}
                  tabBar={(props) => <CustomTabBar {...props} />}
            >
                  <UserTabStack.Screen name="Dashboard" component={UserDashboard} />
                  <UserTabStack.Screen name="HealthRecord" component={HealthRecordScreen} />
                  <UserTabStack.Screen name="WebinarTab" component={WebinarTabScreen} />
                  <UserTabStack.Screen name="Profile" component={UserProfileScreen} />
            </UserTabStack.Navigator>
      );
}
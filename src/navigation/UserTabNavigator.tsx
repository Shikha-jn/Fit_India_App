import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserTabParamList } from '../types/UserTabParamList';
import { HomeScreen } from '../features/dashboard/HomeScreen';

const UserTabStack = createBottomTabNavigator<UserTabParamList>();

export default function UserTabNavigator() {
      return (
            <UserTabStack.Navigator
                  screenOptions={{
                        headerShown: false,
                  }}
            >
                  <UserTabStack.Screen name="Dashboard" component={HomeScreen} />
                  <UserTabStack.Screen name="WorkoutAndDiet" component={HomeScreen} />
                  <UserTabStack.Screen name="Webinars" component={HomeScreen} />
                  <UserTabStack.Screen name="Profile" component={HomeScreen} />
            </UserTabStack.Navigator>
      );
}
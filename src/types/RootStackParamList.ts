import { NavigatorScreenParams } from "@react-navigation/native";
import { TrainerTabParamList } from "./TrainerTabParamList";
import { UserTabParamList } from "./UserTabParamList";
import { MainTabParamList } from "./MainTabParamList";
import { Client } from "../features/clientDirectory/types/clientDirectory";
import { Webinar } from "../features/webinar/types/webinar";

export type RootStackParamList = {
      Splash: undefined;
      Login: undefined;
      Register: undefined;
      MainTab: NavigatorScreenParams<MainTabParamList>;
      UserTab: NavigatorScreenParams<UserTabParamList>;
      TrainerTab: NavigatorScreenParams<TrainerTabParamList>;
      Attendance: {
            attendance: string[],
            joinedDate: any
      };
      Subscription: undefined;
      ScheduleWebinar: {
            isEditing: boolean;
            webinar?: Webinar;
      };
      ClientDetail: {
            client: Client;
      }
      Contact: undefined;
      EditProfile: {
            profile: any;
      }
}
import { NavigatorScreenParams } from "@react-navigation/native";
import { TrainerTabParamList } from "./TrainerTabParamList";
import { UserTabParamList } from "./UserTabParamList";

export type RootStackParamList = {
      Splash: undefined;
      Login: undefined;
      Register: undefined;
      MainTab: undefined;
      UserTab: NavigatorScreenParams<UserTabParamList>;
      TrainerTab: NavigatorScreenParams<TrainerTabParamList>;
}
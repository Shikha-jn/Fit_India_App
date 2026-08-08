import React from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Text } from 'react-native';
import { COLORS } from '../../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';

import AppHeader from '../../components/AppHeader';
import HeroSection from '../../components/HeroSection';
import HolisticSection from '../../components/Holisticsection';
import GoalsSection from '../../components/GoalSection';
import PathwaysSection from '../../components/PathwaySection';
import FounderSection from '../../components/FounderSection';
import TransformationSection from '../../components/TransformationSection';
import ImpactSection from '../../components/ImpactSection';
import { NativeBottomTabScreenProps } from '@react-navigation/bottom-tabs/unstable';
import { TrainerTabParamList } from '../../types/TrainerTabParamList';
import {MainTabParamList} from '../../types/MainTabParamList';

interface PromoBannerProps {
      message: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ message }) => (
      <View style={styles.container}>
            <Icon name="flash" size={13} color={COLORS.gold} />
            <Text style={styles.text} numberOfLines={1}>
                  {message}
            </Text>
      </View>
);

// interface HomeScreenProps {
//       isSignedIn?: boolean;
//       onPressSignIn?: () => void;
//       onPressNotifications?: () => void;
//       onPressProfile?: () => void;
//       onExplorePrograms?: () => void;
//       onBookConsultation?: () => void;
//       onExploreAllServices?: () => void;
//       onReadFounderStory?: () => void;
//       onGetFreeConsultation?: () => void;
// }
type HomeScreenProps = NativeBottomTabScreenProps<MainTabParamList, 'Home'>

const HomeScreen: React.FC<HomeScreenProps> = ({
      
}) => {
      const isSignedIn = true;
      const onPressSignIn = () => {
            console.log("Sign In pressed");
      };
      const onPressNotifications = () => {
            console.log("Notifications pressed");
      };

      const onPressProfile = () => {
            console.log("Profile pressed");
      };

      const onExplorePrograms = () => {
            console.log("Explore Programs pressed");
      };

      const onBookConsultation = () => {
            console.log("Book Consultation pressed");
      };

      const onExploreAllServices = () => {
            console.log("Explore All Services pressed");
      };

      const onReadFounderStory = () => {
            console.log("Read Founder Story pressed");
      };

      const onGetFreeConsultation = () => {
            console.log("Get Free Consultation pressed");
      };
      return (
            <>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                  >
                        <PromoBanner message="Launch Offer: Get 15% discount on all wellness plans!" />
                        <AppHeader
                              isSignedIn={isSignedIn}
                              onPressSignIn={onPressSignIn}
                              onPressNotifications={onPressNotifications}
                              onPressProfile={onPressProfile}
                        />
                        <HeroSection
                              onExplorePrograms={onExplorePrograms}
                              onBookConsultation={onBookConsultation}
                        />
                        <HolisticSection />
                        <GoalsSection />
                        <PathwaysSection onExploreAll={onExploreAllServices} />
                        <FounderSection
                              onReadStory={onReadFounderStory}
                              onGetConsultation={onGetFreeConsultation}
                        />
                        <TransformationSection />
                        <ImpactSection />
                  </ScrollView>
            </>
      );
};

const styles = StyleSheet.create({
      flex: {
            flex: 1,
            backgroundColor: COLORS.background,
      },
      content: {
            paddingBottom: 40,
      },
      container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.primary,
            paddingVertical: 8,
            paddingHorizontal: 12,
      },
      text: {
            color: COLORS.text,
            fontSize: 12,
            fontWeight: '700',
            marginLeft: 6,
      },
});

export default HomeScreen;
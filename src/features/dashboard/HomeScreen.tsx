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
import { MainTabParamList } from '../../types/MainTabParamList';
import { CompositeScreenProps, } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';
import { useAlert } from '../../context/AlertContext';

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

type HomeScreenProps =
      CompositeScreenProps<NativeBottomTabScreenProps<MainTabParamList, 'Home'>,
            NativeStackScreenProps<RootStackParamList>>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
      const alert = useAlert();
      const isSignedIn = true;
      const onPressSignIn = () => {
            // navigation.navigate('Login');
            alert.show({
                  title: 'Login Required',
                  message: 'Please login to continue.',
                  type: 'confirm',
                  buttons: [
                        { label: 'No', style: 'secondary', onPress: () => { alert.dismiss() } },
                        {
                              label: 'Yes, Login',
                              style: 'primary',
                              onPress: () => {
                                    alert.dismiss();
                                    navigation.replace('Login');
                              },
                        },
                  ],
            });
      };
      const onPressNotifications = () => {
            console.log("Notifications pressed");
      };

      const onPressProfile = () => {
            console.log("Profile pressed");
      };

      const onExplorePrograms = () => {
            console.log("Explore Programs pressed");
            navigation.navigate('Services');
      };

      const onBookConsultation = () => {
            console.log("Book Consultation pressed");
            navigation.navigate('Contact');
      };

      const onExploreAllServices = () => {
            console.log("Explore All Services pressed");
            navigation.navigate('Services');
      };

      const onReadFounderStory = () => {
            console.log("Read Founder Story pressed");
      };

      const onGetFreeConsultation = () => {
            console.log("Get Free Consultation pressed");
            navigation.navigate('Contact');
      };
      return (
            <>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                  >
                        {/* <PromoBanner message="Launch Offer: Get 15% discount on all wellness plans!" /> */}
                        <AppHeader
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
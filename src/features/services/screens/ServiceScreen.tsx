import React from 'react';
import { ScrollView, StyleSheet, StatusBar } from 'react-native';
import { COLORS } from '../../../theme/theme';

import ProgramsHeroSection from '../components/ProgramsHeroSection';
import FlagshipProgramSection from '../components/FlagshipProgramSection';
import BlueprintsSection from '../components/BluePrintsSection';
import { NativeBottomTabScreenProps } from '@react-navigation/bottom-tabs/unstable';
import { MainTabParamList } from '../../../types/MainTabParamList';

type ServicesScreenProp = NativeBottomTabScreenProps<MainTabParamList, 'Services'>;

// interface ServicesScreenProps {
//       onBookFreeTrial?: () => void;
//       onEnquireBlueprint?: (blueprintId: string) => void;
// }

const ServicesScreen = ({ navigation }: ServicesScreenProp) => {
      const onBookFreeTrial = () => {
            console.log('Book Free Trial button pressed');
      }
      const onEnquireBlueprint = (blueprintId: string) => {
            console.log(`Enquire about blueprint: ${blueprintId}`);
      }
      return (
            <>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                  >
                        <ProgramsHeroSection />
                        <FlagshipProgramSection onBookFreeTrial={onBookFreeTrial} />
                        <BlueprintsSection onEnquire={onEnquireBlueprint} />
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
            paddingBottom: 48,
      },
});

export default ServicesScreen;
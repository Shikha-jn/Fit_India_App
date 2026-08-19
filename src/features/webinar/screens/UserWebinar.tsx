import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NativeBottomTabScreenProps } from '@react-navigation/bottom-tabs/unstable';
import { UserTabParamList } from '../../../types/UserTabParamList';

import { COLORS } from '../../../theme/theme';
import WebinarTabs, { WebinarTabKey } from '../components/WebinarTabs';
import WebinarScreen from './LiveWebinar';
import ZoomMeetings from '../../zoom/screens/ZoomMeeting';
import RecordedMeetings from '../../recordedMeetings/screens/RecordedMeeting';

type WebinarTabScreenProps = NativeBottomTabScreenProps<UserTabParamList, 'WebinarTab'>;

const WebinarTabScreen = ({ navigation }: WebinarTabScreenProps) => {
      // "live" is the default tab whenever this screen is opened.
      const [selectedTab, setSelectedTab] = useState<WebinarTabKey>('live');

      return (
            <View style={styles.flex}>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

                  <WebinarTabs value={selectedTab} onChange={setSelectedTab} />

                  <View style={styles.content}>
                        {selectedTab === 'live' && <WebinarScreen navigation={navigation} />}
                        {selectedTab === 'zoom' && <ZoomMeetings />}
                        {selectedTab === 'recorded' && <RecordedMeetings />}
                  </View>
            </View>
      );
};

const styles = StyleSheet.create({
      flex: {
            flex: 1,
            backgroundColor: COLORS.background,
      },
      content: {
            flex: 1,
      },
});

export default WebinarTabScreen;
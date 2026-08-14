import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/theme';

interface SectionHeaderProps {
      label: string;
      light?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ label, light }) => (
      <View style={[styles.row, light && styles.rowLight]}>
            <View style={styles.dot} />
            <Text style={[styles.label, light && styles.labelLight]}>{label}</Text>
      </View>
);

const styles = StyleSheet.create({
      row: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 12,
            marginBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.divider,
      },
      rowLight: {
            borderBottomColor: COLORS.border,
      },
      dot: {
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: COLORS.primary,
            marginRight: 8,
      },
      label: {
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            color: '#71717A',
      },
      labelLight: {
            color: COLORS.textMuted,
      },
});

export default SectionHeader;
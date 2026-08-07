import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../../theme/theme';
import { RECOVERY_BLUEPRINTS } from '../types/blueprints';

import Icon from 'react-native-vector-icons/Ionicons';
import { RecoveryBlueprint } from '../types/program';
import { TagPill } from '../components/Badges';
import { ChecklistRow } from '../components/ListRows';
import IconSquare from '../components/IconsSquare';

interface BlueprintCardProps {
      blueprint: RecoveryBlueprint;
      expanded: boolean;
      onToggle: () => void;
      onEnquire?: () => void;
}

const BlueprintCard: React.FC<BlueprintCardProps> = ({
      blueprint,
      expanded,
      onToggle,
      onEnquire,
}) => {
      return (
            <Pressable
                  onPress={onToggle}
                  style={[styles.card, expanded ? styles.cardExpanded : styles.cardCollapsed]}
            >
                  <View style={styles.topRow}>
                        <IconSquare icon={blueprint.icon} active={expanded} />
                        <TagPill label={blueprint.tag} dark={expanded} />
                  </View>

                  <Text style={[styles.cardtitle, { color: expanded ? COLORS.text : '#18181B' }]}>
                        {blueprint.title}
                  </Text>``
                  <Text
                        style={[styles.description, { color: expanded ? COLORS.textSecondary : '#52525B' }]}
                  >
                        {blueprint.description}
                  </Text>

                  {expanded && (
                        <>
                              <View style={styles.divider} />
                              {blueprint.checklist.map((item) => (
                                    <ChecklistRow key={item} text={item} tone="primary" dense />
                              ))}

                              <Pressable onPress={onEnquire} style={styles.enquireBtn}>
                                    <Text style={styles.enquireText}>Enquire Now</Text>
                              </Pressable>
                        </>
                  )}

                  {!expanded && (
                        <View style={styles.expandHint}>
                              <Text style={styles.expandHintText}>Tap to see full details</Text>
                              <Icon name="chevron-down" size={14} color={COLORS.primary} />
                        </View>
                  )}
            </Pressable>
      );
};


interface BlueprintsSectionProps {
      onEnquire?: (blueprintId: string) => void;
}

const BlueprintsSection: React.FC<BlueprintsSectionProps> = ({ onEnquire }) => {
      const [expandedId, setExpandedId] = useState<string | null>(
            RECOVERY_BLUEPRINTS[0]?.id ?? null,
      );

      const toggle = (id: string) => {
            setExpandedId((current) => (current === id ? null : id));
      };

      return (
            <View style={styles.container}>
                  <View style={styles.headerBlock}>
                        <Text style={styles.eyebrow}>Focus Blueprints</Text>
                        <Text style={styles.title}>Our Specialised Recovery Blueprints</Text>
                        <Text style={styles.subtitle}>
                              Every participant receives personalized care modules targeting
                              specific body areas and physiological needs.
                        </Text>
                  </View>

                  {RECOVERY_BLUEPRINTS.map((blueprint) => (
                        <BlueprintCard
                              key={blueprint.id}
                              blueprint={blueprint}
                              expanded={expandedId === blueprint.id}
                              onToggle={() => toggle(blueprint.id)}
                              onEnquire={() => onEnquire?.(blueprint.id)}
                        />
                  ))}
            </View>
      );
};

const styles = StyleSheet.create({
      container: {
            backgroundColor: COLORS.backgroundLight,
            paddingHorizontal: 20,
            paddingTop: 44,
            paddingBottom: 20,
      },
      headerBlock: {
            alignItems: 'center',
            marginBottom: 28,
      },
      eyebrow: {
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            color: COLORS.goldDark,
            marginBottom: 8,
      },
      title: {
            fontSize: 23,
            fontWeight: '800',
            color: '#18181B',
            textAlign: 'center',
            marginBottom: 10,
      },
      subtitle: {
            fontSize: 13,
            color: '#52525B',
            textAlign: 'center',
            lineHeight: 19,
      },
      // Additional styles for BlueprintCard
      card: {
            borderRadius: 24,
            padding: 22,
            marginBottom: 16,
      },
      cardCollapsed: {
            backgroundColor: COLORS.surfaceLight,
            borderWidth: 1,
            borderColor: '#E4E4E7',
      },
      cardExpanded: {
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.primary,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
      },
      topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
      },
      cardtitle: {
            fontSize: 19,
            fontWeight: '800',
            marginBottom: 8,
      },
      description: {
            fontSize: 13,
            lineHeight: 19,
      },
      divider: {
            height: 1,
            backgroundColor: COLORS.border,
            marginTop: 18,
            marginBottom: 16,
      },
      enquireBtn: {
            height: 52,
            borderRadius: 14,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 6,
      },
      enquireText: {
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '800',
      },
      expandHint: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 14,
      },
      expandHintText: {
            fontSize: 11.5,
            fontWeight: '700',
            color: COLORS.primary,
            marginRight: 4,
      },
});

export default BlueprintsSection;
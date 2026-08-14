import React, { useEffect, useMemo, useState } from 'react';
import {
      View,
      FlatList,
      StyleSheet,
      StatusBar,
      RefreshControl,
      ActivityIndicator,
      Text,
      Pressable,
      Image,
      TextInput
} from 'react-native';
import { COLORS } from '../../../theme/theme';
import { Client, ClientStatusFilter } from '../types/clientDirectory';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeBottomTabScreenProps } from '@react-navigation/bottom-tabs/unstable';
import { CompositeScreenProps, } from '@react-navigation/native';

import { getPlanExpiryInfo } from '../types/PlanExpire';
import { TrainerTabParamList } from '../../../types/TrainerTabParamList';
import { useAlert } from '../../../context/AlertContext';
import { getClients } from '../../../services/trainer.service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/RootStackParamList';

interface FilterOption {
      value: ClientStatusFilter;
      label: string;
}

const OPTIONS: FilterOption[] = [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
];

interface StatusFilterTabsProps {
      value: ClientStatusFilter;
      onChange: (value: ClientStatusFilter) => void;
      counts: Record<ClientStatusFilter, number>;
}

const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({
      value,
      onChange,
      counts,
}) => (
      <View style={styles.row}>
            {OPTIONS.map((opt) => {
                  const isActive = opt.value === value;
                  return (
                        <Pressable
                              key={opt.value}
                              onPress={() => onChange(opt.value)}
                              style={[styles.pill, isActive && styles.pillActive]}
                        >
                              <Text style={[styles.label, isActive && styles.labelActive]}>
                                    {opt.label}
                              </Text>
                              <Text style={[styles.count, isActive && styles.countActive]}>
                                    {counts[opt.value] ?? 0}
                              </Text>
                        </Pressable>
                  );
            })}
      </View>
);

interface ConditionChipProps {
      label: string;
}

const ConditionChip: React.FC<ConditionChipProps> = ({ label }) => (
      <View style={styles.chip}>
            <Text style={styles.chiplabel}>{label}</Text>
      </View>
);

interface SearchBarProps {
      value: string;
      onChangeText: (text: string) => void;
      placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
      value,
      onChangeText,
      placeholder = 'Search members by name or goal…',
}) => (
      <View style={styles.wrap}>
            <Icon name="search-outline" size={17} color={COLORS.textMuted} />
            <TextInput
                  value={value}
                  onChangeText={onChangeText}
                  placeholder={placeholder}
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
            />
            {value.length > 0 && (
                  <Pressable onPress={() => onChangeText('')} hitSlop={8}>
                        <Icon name="close-circle" size={17} color={COLORS.textMuted} />
                  </Pressable>
            )}
      </View>
);

interface DirectoryHeaderProps {
      count: number;
}

const DirectoryHeader: React.FC<DirectoryHeaderProps> = ({ count }) => (
      <View style={styles.container}>
            <View style={styles.titleRow}>
                  <Icon name="people" size={20} color={COLORS.primary} />
                  <Text style={styles.title}>Assigned Members Directory</Text>
            </View>

            <LinearGradient
                  colors={[COLORS.primary, COLORS.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.countPill}
            >
                  <Text style={styles.countText}>
                        {count} {count === 1 ? 'Member' : 'Members'}
                  </Text>
            </LinearGradient>
      </View>
);

interface EmptyDirectoryStateProps {
      title: string;
      message: string;
}

const EmptyDirectoryState: React.FC<EmptyDirectoryStateProps> = ({
      title,
      message,
}) => (
      <View style={styles.empcontainer}>
            <View style={styles.iconCircle}>
                  <Icon name="people-outline" size={30} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptitle}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
      </View>
);

interface StatusBadgeProps {
      status: Client['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
      const isActive = status === 'active';
      return (
            <View
                  style={[
                        styles.badge,
                        {
                              backgroundColor: isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(161, 161, 170, 0.15)',
                              borderColor: isActive ? 'rgba(34, 197, 94, 0.35)' : 'rgba(161, 161, 170, 0.3)',
                        },
                  ]}
            >
                  <View
                        style={[
                              styles.dot,
                              { backgroundColor: isActive ? COLORS.success : COLORS.textMuted },
                        ]}
                  />
                  <Text style={[styles.text, { color: isActive ? '#15803D' : '#71717A' }]}>
                        {isActive ? 'Active' : 'Inactive'}
                  </Text>
            </View>
      );
};

interface ClientCardProps {
      client: Client;
      navigation: any;
}

const MAX_VISIBLE_CONDITIONS = 3;

const ClientCard: React.FC<ClientCardProps> = ({ client, navigation }) => {
      const expiry = getPlanExpiryInfo(client.activePlanExpiresAt);
      const visibleConditions = client.medicalConditions.slice(0, MAX_VISIBLE_CONDITIONS);
      const extraConditions = client.medicalConditions.length - visibleConditions.length;

      const onOpenWorkspace = () => {
            navigation.navigate('ClientDetail', { client: client });
      }

      return (
            <View style={styles.card}>
                  <View style={styles.topRow}>
                        {client.profileImage ? (
                              <Image source={{ uri: client.profileImage }} style={styles.avatar} />
                        ) : (
                              <View style={[styles.avatar, styles.avatarFallback]}>
                                    <Text style={styles.avatarInitial}>
                                          {client.name.charAt(0).toUpperCase()}
                                    </Text>
                              </View>
                        )}
                        <StatusBadge status={client.status} />
                  </View>

                  <Text style={styles.name}>{client.name}</Text>
                  <Text style={styles.goal}>Goal: {client.fitnessGoal}</Text>

                  {(expiry.isExpired || expiry.isExpiringSoon) && (
                        <View style={styles.expiryRow}>
                              <Icon
                                    name="alert-circle"
                                    size={13}
                                    color={expiry.isExpired ? COLORS.error : COLORS.warning}
                              />
                              <Text
                                    style={[
                                          styles.expiryText,
                                          { color: expiry.isExpired ? COLORS.error : COLORS.warning },
                                    ]}
                              >
                                    {expiry.isExpired
                                          ? 'Plan expired'
                                          : `Plan expires in ${expiry.daysLeft}d`}
                              </Text>
                        </View>
                  )}

                  {visibleConditions.length > 0 && (
                        <View style={styles.chipRow}>
                              {visibleConditions.map((condition) => (
                                    <ConditionChip key={condition} label={condition} />
                              ))}
                              {extraConditions > 0 && (
                                    <View style={styles.moreChip}>
                                          <Text style={styles.moreChipText}>+{extraConditions}</Text>
                                    </View>
                              )}
                        </View>
                  )}

                  <Pressable
                        onPress={onOpenWorkspace}
                        style={styles.workspaceBtn}
                  >
                        <Text style={styles.workspaceBtnText}>Open Member Workspace</Text>
                        <Icon name="chevron-forward" size={16} color={COLORS.primary} />
                  </Pressable>
            </View>
      );
};

type ClientDirectoryScreenProps = CompositeScreenProps<
      NativeBottomTabScreenProps<TrainerTabParamList, 'ClientDirectory'>,
      NativeStackScreenProps<RootStackParamList>>;

const ClientDirectoryScreen = ({ navigation }: ClientDirectoryScreenProps) => {
      const [clients, setClients] = useState<Client[]>([]);
      const [refreshing, setrefreshing] = useState(false);
      const [loading, setloading] = useState(false);
      const [search, setSearch] = useState('');
      const [statusFilter, setStatusFilter] = useState<ClientStatusFilter>('all');
      const alert = useAlert();

      const counts = useMemo(() => {
            return {
                  all: clients.length,
                  active: clients.filter((c) => c.status === 'active').length,
                  inactive: clients.filter((c) => c.status === 'inactive').length,
            } as Record<ClientStatusFilter, number>;
      }, [clients]);

      useEffect(() => {
            fetchClientsData();
      }, []);
      const fetchClientsData = async () => {
            try {
                  const response = await getClients();
                  const clientData = response.data;
                  setClients(clientData);
            } catch (error) {
                  console.error('Error fetching trainer profile:', error);
                  alert.error('Error', 'Failed to fetch trainer profile. Please try again later.');
            }
      }

      const onRefresh = () => {
            try {
                  setrefreshing(true);
                  fetchClientsData();
            } finally {
                  setrefreshing(false);
            }
      }

      const filtered = useMemo(() => {
            const query = search.trim().toLowerCase();
            return clients.filter((client) => {
                  const matchesStatus =
                        statusFilter === 'all' || client.status === statusFilter;
                  const matchesQuery =
                        !query ||
                        client.name.toLowerCase().includes(query) ||
                        client.fitnessGoal.toLowerCase().includes(query);
                  return matchesStatus && matchesQuery;
            });
      }, [clients, search, statusFilter]);

      return (
            <View style={styles.flex}>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                  <FlatList
                        data={filtered}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                              onRefresh ? (
                                    <RefreshControl
                                          refreshing={!!refreshing}
                                          onRefresh={onRefresh}
                                          tintColor={COLORS.gold}
                                          colors={[COLORS.primary]}
                                    />
                              ) : undefined
                        }
                        ListHeaderComponent={
                              <>
                                    <DirectoryHeader count={clients.length} />
                                    <View style={styles.searchWrap}>
                                          <SearchBar value={search} onChangeText={setSearch} />
                                    </View>
                                    <StatusFilterTabs
                                          value={statusFilter}
                                          onChange={setStatusFilter}
                                          counts={counts}
                                    />
                                    {loading && (
                                          <View style={styles.loadingRow}>
                                                <ActivityIndicator color={COLORS.gold} />
                                                <Text style={styles.loadingText}>Loading members…</Text>
                                          </View>
                                    )}
                              </>
                        }
                        renderItem={({ item }) => (
                              <View style={styles.cardWrap}>
                                    <ClientCard client={item} navigation={navigation} />
                              </View>
                        )}
                        ListEmptyComponent={
                              !loading ? (
                                    <EmptyDirectoryState
                                          title={
                                                search
                                                      ? 'No members match your search'
                                                      : statusFilter === 'all'
                                                            ? 'No members assigned yet'
                                                            : `No ${statusFilter} members`
                                          }
                                          message={
                                                search
                                                      ? 'Try a different name or fitness goal.'
                                                      : 'New members assigned to you will appear here.'
                                          }
                                    />
                              ) : null
                        }
                  />
            </View>
      );
};

const styles = StyleSheet.create({
      flex: {
            flex: 1,
            backgroundColor: COLORS.background,
      },
      listContent: {
            paddingBottom: 40,
      },
      searchWrap: {
            paddingHorizontal: 20,
            marginBottom: 16,
      },
      loadingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20,
      },
      loadingText: {
            color: COLORS.textMuted,
            fontSize: 12,
            fontWeight: '600',
            marginLeft: 8,
      },
      cardWrap: {
            paddingHorizontal: 20,
      },
      // Header styles
      container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
      },
      titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            flexShrink: 1,
            marginRight: 12,
      },
      title: {
            fontSize: 16,
            fontWeight: '800',
            color: COLORS.text,
            marginLeft: 10,
            flexShrink: 1,
      },
      countPill: {
            borderRadius: 999,
            paddingVertical: 7,
            paddingHorizontal: 14,
      },
      countText: {
            color: COLORS.text,
            fontSize: 11.5,
            fontWeight: '800',
      },
      //Status filter styles
      row: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 8,
            marginBottom: 18,
      },
      pill: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 999,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
      },
      pillActive: {
            backgroundColor: COLORS.primary,
            borderColor: COLORS.primary,
      },
      label: {
            fontSize: 12.5,
            fontWeight: '700',
            color: COLORS.textMuted,
            marginRight: 6,
      },
      labelActive: {
            color: COLORS.text,
      },
      count: {
            fontSize: 11,
            fontWeight: '800',
            color: COLORS.textMuted,
      },
      countActive: {
            color: 'rgba(255,255,255,0.8)',
      },
      //Card styles
      card: {
            backgroundColor: COLORS.surface,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 18,
            marginBottom: 16,
      },
      topRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 14,
      },
      avatar: {
            // width: 56,
            // height: 56,
            // borderRadius: 28,
            width: 60,
            height: 60,
            borderRadius: 30,
      },
      avatarFallback: {
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
      },
      avatarInitial: {
            color: COLORS.text,
            fontSize: 20,
            fontWeight: '800',
      },
      name: {
            fontSize: 16,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 4,
      },
      goal: {
            fontSize: 12.5,
            color: '#71717A',
            fontWeight: '600',
            marginBottom: 10,
      },
      expiryRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
      },
      expiryText: {
            fontSize: 11.5,
            fontWeight: '700',
            marginLeft: 5,
      },
      chipRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 6,
      },
      moreChip: {
            backgroundColor: '#F4F4F5',
            borderRadius: 8,
            paddingVertical: 5,
            paddingHorizontal: 10,
            marginBottom: 6,
      },
      moreChipText: {
            fontSize: 10.5,
            fontWeight: '800',
            color: '#71717A',
      },
      workspaceBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            height: 48,
            borderRadius: 14,
            backgroundColor: 'rgba(166, 24, 82, 0.08)',
            borderColor: COLORS.primary,
            borderWidth: 1,
      },
      workspaceBtnText: {
            color: COLORS.primary,
            fontSize: 13.5,
            fontWeight: '800',
            marginRight: 6,
      },
      //Empty state styles
      empcontainer: {
            marginHorizontal: 20,
            marginTop: 8,
            borderRadius: 22,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: COLORS.border,
            paddingVertical: 44,
            paddingHorizontal: 24,
            alignItems: 'center',
      },
      iconCircle: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
      },
      emptitle: {
            fontSize: 15,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 8,
      },
      message: {
            fontSize: 12.5,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 19,
      },
      //status styles
      badge: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            borderRadius: 999,
            borderWidth: 1,
            paddingVertical: 5,
            paddingHorizontal: 10,
      },
      dot: {
            width: 5,
            height: 5,
            borderRadius: 2.5,
            marginRight: 5,
      },
      text: {
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
      },
      //condition chip styles
      chip: {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 8,
            paddingVertical: 5,
            paddingHorizontal: 10,
            marginRight: 8,
            marginBottom: 6,
      },
      chiplabel: {
            fontSize: 10.5,
            fontWeight: '800',
            color: '#DC2626',
            letterSpacing: 0.3,
      },
      //seacrh bar styles
      wrap: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 14,
            height: 46,
      },
      input: {
            flex: 1,
            color: COLORS.text,
            fontSize: 13.5,
            marginLeft: 10,
            padding: 0,
            height: '100%',
      },
});

export default ClientDirectoryScreen;
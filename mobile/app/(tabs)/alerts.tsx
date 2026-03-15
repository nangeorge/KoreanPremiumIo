/**
 * Alerts screen.
 * Free users: 1 alert max — show upgrade prompt if they try to add more.
 * Premium users: unlimited alerts.
 */
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  Alert as RNAlert,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppStore } from '../../src/store';
import { registerForPushNotifications } from '../../src/services/notifications';
import { AlertModal } from '../../src/components/AlertModal';
import type { Alert } from '../../src/types';
import { FREE_TIER_ALERT_LIMIT } from '../../src/utils/validate';

const LABELS = {
  ko: {
    title: '알림 설정',
    subtitle: '프리미엄 임계값 알림',
    addAlert: '알림 추가',
    noAlerts: '설정된 알림이 없습니다',
    noAlertsHint: '+ 버튼을 눌러 새 알림을 추가하세요',
    above: '이상',
    below: '이하',
    binance: '바이낸스',
    coinbase: '코인베이스',
    delete: '삭제',
    deleteConfirm: '이 알림을 삭제하시겠습니까?',
    deleteTitle: '알림 삭제',
    cancel: '취소',
    premiumBadge: 'PREMIUM',
    freeLimitTitle: '무료 플랜 제한',
    freeLimitMsg: `무료 플랜에서는 알림을 ${FREE_TIER_ALERT_LIMIT}개까지 설정할 수 있습니다.\n프리미엄으로 업그레이드하면 무제한으로 알림을 설정할 수 있습니다.`,
    upgrade: '업그레이드',
    later: '나중에',
    permissionTitle: '알림 권한',
    permissionMsg: '알림을 받으려면 알림 권한이 필요합니다.',
    permissionDenied: '알림 권한이 거부되었습니다. 설정에서 권한을 허용해주세요.',
    ok: '확인',
    lastTriggered: '마지막 발동',
    never: '없음',
    vs: 'vs',
  },
  en: {
    title: 'Alert Settings',
    subtitle: 'Premium threshold alerts',
    addAlert: 'Add Alert',
    noAlerts: 'No alerts set',
    noAlertsHint: 'Tap + to add your first alert',
    above: 'above',
    below: 'below',
    binance: 'Binance',
    coinbase: 'Coinbase',
    delete: 'Delete',
    deleteConfirm: 'Delete this alert?',
    deleteTitle: 'Delete Alert',
    cancel: 'Cancel',
    premiumBadge: 'PREMIUM',
    freeLimitTitle: 'Free Plan Limit',
    freeLimitMsg: `The free plan supports up to ${FREE_TIER_ALERT_LIMIT} alert.\nUpgrade to Premium for unlimited alerts.`,
    upgrade: 'Upgrade',
    later: 'Later',
    permissionTitle: 'Notification Permission',
    permissionMsg: 'Permission is needed to send you alerts.',
    permissionDenied: 'Notification permission denied. Please enable it in Settings.',
    ok: 'OK',
    lastTriggered: 'Last triggered',
    never: 'Never',
    vs: 'vs',
  },
  zh: {
    title: '提醒设置',
    subtitle: '溢价阈值提醒',
    addAlert: '添加提醒',
    noAlerts: '暂无提醒',
    noAlertsHint: '点击 + 添加提醒',
    above: '高于',
    below: '低于',
    binance: '币安',
    coinbase: 'Coinbase',
    delete: '删除',
    deleteConfirm: '删除此提醒?',
    deleteTitle: '删除提醒',
    cancel: '取消',
    premiumBadge: 'PREMIUM',
    freeLimitTitle: '免费计划限制',
    freeLimitMsg: `免费计划最多支持 ${FREE_TIER_ALERT_LIMIT} 个提醒。\n升级至 Premium 可解锁无限提醒。`,
    upgrade: '升级',
    later: '稍后',
    permissionTitle: '通知权限',
    permissionMsg: '需要通知权限才能发送提醒。',
    permissionDenied: '通知权限被拒绝。请在设置中启用。',
    ok: '确定',
    lastTriggered: '上次触发',
    never: '从未',
    vs: 'vs',
  },
} as const;

export default function AlertsScreen() {
  const { alerts, isPremium, language, selectedExchange, addAlert, removeAlert, toggleAlert } =
    useAppStore();
  const t = LABELS[language];

  const [modalVisible, setModalVisible] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Request notification permission on mount
  useEffect(() => {
    registerForPushNotifications().then((result) => {
      setPermissionGranted(result.granted);
      if (!result.granted && result.error === 'permission_denied') {
        RNAlert.alert(t.permissionTitle, t.permissionDenied, [{ text: t.ok }]);
      }
    });
  }, [t]);

  const handleAddPress = useCallback(() => {
    if (!isPremium && alerts.length >= FREE_TIER_ALERT_LIMIT) {
      RNAlert.alert(t.freeLimitTitle, t.freeLimitMsg, [
        { text: t.later, style: 'cancel' },
        {
          text: t.upgrade,
          onPress: () => {
            // Navigate to settings → subscription
            // Using router.push here would require importing from expo-router
            // For now, inform the user; settings tab handles purchase
            RNAlert.alert(
              language === 'ko' ? '설정 탭으로 이동하세요' : language === 'zh' ? '请前往设置标签' : 'Go to Settings tab',
              language === 'ko'
                ? '설정 → 구독하기에서 프리미엄을 구매할 수 있습니다.'
                : language === 'zh'
                ? '在"设置 → 订阅"中购买 Premium。'
                : 'You can purchase Premium in Settings → Subscription.',
              [{ text: t.ok }],
            );
          },
        },
      ]);
      return;
    }

    if (!permissionGranted) {
      RNAlert.alert(t.permissionTitle, t.permissionMsg, [{ text: t.ok }]);
    }

    setModalVisible(true);
  }, [isPremium, alerts.length, permissionGranted, language, t]);

  const handleDelete = useCallback(
    (id: string) => {
      RNAlert.alert(t.deleteTitle, t.deleteConfirm, [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.delete,
          style: 'destructive',
          onPress: () => removeAlert(id),
        },
      ]);
    },
    [removeAlert, t],
  );

  const renderAlert = useCallback(
    ({ item }: { item: Alert }) => {
      const exchangeLabel = item.exchange === 'coinbase' ? t.coinbase : t.binance;
      const dirLabel = item.direction === 'above' ? t.above : t.below;
      const lastTriggered = item.lastTriggeredAt
        ? new Date(item.lastTriggeredAt).toLocaleString(
            language === 'ko' ? 'ko-KR' : language === 'zh' ? 'zh-CN' : 'en-US',
            { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
          )
        : t.never;

      return (
        <View style={[styles.alertCard, !item.enabled && styles.alertCardDisabled]}>
          <View style={styles.alertLeft}>
            {/* Symbol + direction */}
            <View style={styles.alertHeader}>
              <Text style={styles.alertSymbol}>{item.symbol}</Text>
              <View
                style={[
                  styles.directionBadge,
                  {
                    backgroundColor:
                      item.direction === 'above'
                        ? 'rgba(16,185,129,0.15)'
                        : 'rgba(239,68,68,0.15)',
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: item.direction === 'above' ? '#10b981' : '#ef4444',
                  }}
                >
                  {item.direction === 'above' ? '↑' : '↓'} {dirLabel}{' '}
                  {item.threshold.toFixed(2)}%
                </Text>
              </View>
            </View>

            {/* Exchange + last triggered */}
            <Text style={styles.alertMeta}>
              {t.vs} {exchangeLabel}
            </Text>
            <Text style={styles.alertLastTriggered}>
              {t.lastTriggered}: {lastTriggered}
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.alertControls}>
            <Switch
              value={item.enabled}
              onValueChange={() => toggleAlert(item.id)}
              trackColor={{ false: '#374151', true: 'rgba(99,102,241,0.5)' }}
              thumbColor={item.enabled ? '#6366f1' : '#6b7280'}
            />
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.deleteBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [language, t, toggleAlert, handleDelete],
  );

  const ListEmpty = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🔔</Text>
      <Text style={styles.emptyTitle}>{t.noAlerts}</Text>
      <Text style={styles.emptyHint}>{t.noAlertsHint}</Text>
    </View>
  );

  const ListHeader = (
    <LinearGradient
      colors={['#0f0f1e', '#111128', '#0a0a18']}
      style={styles.hero}
    >
      <View style={styles.heroRow}>
        <View>
          <Text style={styles.heroTitle}>{t.title}</Text>
          <Text style={styles.heroSubtitle}>{t.subtitle}</Text>
        </View>
        {isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>{t.premiumBadge}</Text>
          </View>
        )}
      </View>

      {/* Alert count / limit */}
      <View style={styles.limitRow}>
        <Text style={styles.limitText}>
          {language === 'ko'
            ? `알림 ${alerts.length}개 ${isPremium ? '(무제한)' : `/ ${FREE_TIER_ALERT_LIMIT}개`}`
            : language === 'zh'
            ? `${alerts.length} 个提醒 ${isPremium ? '（无限）' : `/ ${FREE_TIER_ALERT_LIMIT}`}`
            : `${alerts.length} alert${alerts.length !== 1 ? 's' : ''} ${isPremium ? '(unlimited)' : `/ ${FREE_TIER_ALERT_LIMIT}`}`}
        </Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAddPress}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Free tier upgrade hint */}
      {!isPremium && (
        <View style={styles.upgradeHint}>
          <Text style={styles.upgradeHintText}>
            {language === 'ko'
              ? '🚀 프리미엄: 무제한 알림 + 광고 없음'
              : language === 'zh'
              ? '🚀 Premium: 无限提醒 + 无广告'
              : '🚀 Premium: unlimited alerts + no ads'}
          </Text>
        </View>
      )}
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <AlertModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={addAlert}
        language={language}
        selectedExchange={selectedExchange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listContent: {
    paddingBottom: 32,
    flexGrow: 1,
  },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 8,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#e8e8f0',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  premiumBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6366f1',
    letterSpacing: 1,
  },
  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  limitText: {
    fontSize: 13,
    color: '#6b7280',
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtnText: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '300',
    lineHeight: 26,
  },
  upgradeHint: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(99,102,241,0.08)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
  },
  upgradeHintText: {
    fontSize: 12,
    color: '#a5b4fc',
    fontWeight: '500',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  alertCardDisabled: {
    opacity: 0.5,
  },
  alertLeft: {
    flex: 1,
    gap: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertSymbol: {
    fontSize: 15,
    fontWeight: '800',
    color: '#e8e8f0',
    letterSpacing: 0.5,
  },
  directionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  alertMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
  alertLastTriggered: {
    fontSize: 10,
    color: '#374151',
  },
  alertControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
  },
});

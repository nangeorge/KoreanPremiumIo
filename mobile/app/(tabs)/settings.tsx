/**
 * Settings screen.
 * - Language selection (한국어 / English / 中文)
 * - Subscription status + subscribe/restore button
 * - About section (version from expo-constants)
 * - Security info
 */
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert as RNAlert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppStore } from '../../src/store';
import type { Language } from '../../src/types';
import {
  fetchOfferings,
  purchasePackage,
  restorePurchases,
  type OfferingPackage,
} from '../../src/services/purchases';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

const LABELS = {
  ko: {
    title: '설정',
    language: '언어',
    subscription: '구독',
    subscriptionStatus: '구독 상태',
    free: '무료',
    premium: '프리미엄',
    subscribe: '구독하기',
    restore: '구매 복원',
    about: '정보',
    version: '버전',
    security: '보안 정보',
    securityNote: 'HTTPS 전용 통신 · 민감 데이터 암호화 저장 · 기기에 코인 데이터 미저장',
    privacyPolicy: '개인정보 처리방침',
    terms: '이용약관',
    contact: '문의하기',
    freeBenefits: '무료 플랜 혜택',
    freeBenefitsList: ['1개 알림 설정', '실시간 시세 조회', '기본 차트'],
    premiumBenefits: '프리미엄 혜택',
    premiumBenefitsList: ['무제한 알림', '광고 없음', '모든 기능 사용'],
    purchaseError: '구매 오류',
    purchaseSuccess: '구매 완료',
    purchaseSuccessMsg: '프리미엄 구독이 활성화되었습니다!',
    restoreSuccess: '복원 완료',
    restoreSuccessMsg: '구독이 복원되었습니다.',
    restoreNothing: '복원할 구독이 없습니다.',
    ok: '확인',
    alreadyPremium: '현재 프리미엄 플랜을 사용 중입니다.',
  },
  en: {
    title: 'Settings',
    language: 'Language',
    subscription: 'Subscription',
    subscriptionStatus: 'Status',
    free: 'Free',
    premium: 'Premium',
    subscribe: 'Subscribe',
    restore: 'Restore Purchases',
    about: 'About',
    version: 'Version',
    security: 'Security',
    securityNote: 'HTTPS-only · Sensitive data encrypted · No coin data stored on device',
    privacyPolicy: 'Privacy Policy',
    terms: 'Terms of Service',
    contact: 'Contact Us',
    freeBenefits: 'Free Plan',
    freeBenefitsList: ['1 alert', 'Real-time prices', 'Basic charts'],
    premiumBenefits: 'Premium',
    premiumBenefitsList: ['Unlimited alerts', 'No ads', 'Full access'],
    purchaseError: 'Purchase Error',
    purchaseSuccess: 'Purchase Complete',
    purchaseSuccessMsg: 'Your Premium subscription is now active!',
    restoreSuccess: 'Restore Complete',
    restoreSuccessMsg: 'Your subscription has been restored.',
    restoreNothing: 'No purchases to restore.',
    ok: 'OK',
    alreadyPremium: 'You are already on the Premium plan.',
  },
  zh: {
    title: '设置',
    language: '语言',
    subscription: '订阅',
    subscriptionStatus: '状态',
    free: '免费',
    premium: 'Premium',
    subscribe: '订阅',
    restore: '恢复购买',
    about: '关于',
    version: '版本',
    security: '安全',
    securityNote: '仅HTTPS · 敏感数据加密存储 · 不在设备存储币价数据',
    privacyPolicy: '隐私政策',
    terms: '服务条款',
    contact: '联系我们',
    freeBenefits: '免费计划',
    freeBenefitsList: ['1个提醒', '实时行情', '基础图表'],
    premiumBenefits: 'Premium',
    premiumBenefitsList: ['无限提醒', '无广告', '全功能'],
    purchaseError: '购买错误',
    purchaseSuccess: '购买成功',
    purchaseSuccessMsg: 'Premium 订阅已激活！',
    restoreSuccess: '恢复成功',
    restoreSuccessMsg: '订阅已恢复。',
    restoreNothing: '没有可恢复的购买记录。',
    ok: '确定',
    alreadyPremium: '您已是 Premium 用户。',
  },
} as const;

const LANGUAGE_OPTIONS: { value: Language; label: string; flag: string }[] = [
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
];

export default function SettingsScreen() {
  const { language, isPremium, setLanguage, setIsPremium } = useAppStore();
  const t = LABELS[language];

  const [offerings, setOfferings] = useState<OfferingPackage[]>([]);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Load offerings when subscription section becomes visible
  useEffect(() => {
    if (!isPremium) {
      setIsLoadingOfferings(true);
      fetchOfferings()
        .then(setOfferings)
        .finally(() => setIsLoadingOfferings(false));
    }
  }, [isPremium]);

  const handleSubscribe = useCallback(
    async (pkg: OfferingPackage) => {
      if (isPurchasing) return;
      setIsPurchasing(true);
      try {
        const result = await purchasePackage(pkg.rcPackage);
        if (result.cancelled) return;
        if (result.success && result.isPremium) {
          setIsPremium(true);
          RNAlert.alert(t.purchaseSuccess, t.purchaseSuccessMsg, [{ text: t.ok }]);
        } else if (result.error) {
          RNAlert.alert(t.purchaseError, result.error, [{ text: t.ok }]);
        }
      } finally {
        setIsPurchasing(false);
      }
    },
    [isPurchasing, setIsPremium, t],
  );

  const handleRestore = useCallback(async () => {
    if (isRestoring) return;
    setIsRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.success && result.isPremium) {
        setIsPremium(true);
        RNAlert.alert(t.restoreSuccess, t.restoreSuccessMsg, [{ text: t.ok }]);
      } else {
        RNAlert.alert(t.restoreSuccess, t.restoreNothing, [{ text: t.ok }]);
      }
    } finally {
      setIsRestoring(false);
    }
  }, [isRestoring, setIsPremium, t]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#0f0f1e', '#111128', '#0a0a18']}
          style={styles.hero}
        >
          <Text style={styles.heroTitle}>⚙️ {t.title}</Text>
        </LinearGradient>

        {/* ── Language ── */}
        <SectionHeader title={t.language} />
        <View style={styles.card}>
          {LANGUAGE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.languageRow,
                language === opt.value && styles.languageRowActive,
              ]}
              onPress={() => setLanguage(opt.value)}
            >
              <Text style={styles.languageFlag}>{opt.flag}</Text>
              <Text
                style={[
                  styles.languageLabel,
                  language === opt.value && styles.languageLabelActive,
                ]}
              >
                {opt.label}
              </Text>
              {language === opt.value && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Subscription ── */}
        <SectionHeader title={t.subscription} />
        <View style={styles.card}>
          {/* Status row */}
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>{t.subscriptionStatus}</Text>
            <View
              style={[
                styles.statusBadge,
                isPremium
                  ? styles.statusBadgePremium
                  : styles.statusBadgeFree,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  isPremium
                    ? styles.statusBadgeTextPremium
                    : styles.statusBadgeTextFree,
                ]}
              >
                {isPremium ? '✦ ' + t.premium : t.free}
              </Text>
            </View>
          </View>

          {/* Benefits comparison */}
          <View style={styles.benefitsRow}>
            <BenefitsColumn
              title={t.freeBenefits}
              items={t.freeBenefitsList as unknown as string[]}
              active={!isPremium}
            />
            <View style={styles.benefitsDivider} />
            <BenefitsColumn
              title={t.premiumBenefits}
              items={t.premiumBenefitsList as unknown as string[]}
              active={isPremium}
              highlight
            />
          </View>

          {/* Subscribe / already premium */}
          {isPremium ? (
            <View style={styles.alreadyPremium}>
              <Text style={styles.alreadyPremiumText}>{t.alreadyPremium}</Text>
            </View>
          ) : isLoadingOfferings ? (
            <ActivityIndicator color="#6366f1" style={{ marginVertical: 16 }} />
          ) : offerings.length > 0 ? (
            offerings.map((pkg) => (
              <TouchableOpacity
                key={pkg.identifier}
                style={[styles.subscribeBtn, isPurchasing && styles.subscribeBtnLoading]}
                onPress={() => handleSubscribe(pkg)}
                disabled={isPurchasing}
              >
                {isPurchasing ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Text style={styles.subscribeBtnText}>{t.subscribe}</Text>
                    <Text style={styles.subscribeBtnPrice}>{pkg.priceString} / mo</Text>
                  </>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity
              style={styles.subscribeBtn}
              onPress={() =>
                RNAlert.alert(
                  language === 'ko' ? '준비 중' : language === 'zh' ? '即将推出' : 'Coming Soon',
                  language === 'ko'
                    ? '스토어 설정이 완료되면 구독이 가능합니다.'
                    : language === 'zh'
                    ? '商店设置完成后即可订阅。'
                    : 'Subscription will be available once the store is configured.',
                  [{ text: t.ok }],
                )
              }
            >
              <Text style={styles.subscribeBtnText}>{t.subscribe}</Text>
            </TouchableOpacity>
          )}

          {/* Restore button */}
          <TouchableOpacity
            style={styles.restoreBtn}
            onPress={handleRestore}
            disabled={isRestoring}
          >
            {isRestoring ? (
              <ActivityIndicator color="#6b7280" size="small" />
            ) : (
              <Text style={styles.restoreBtnText}>{t.restore}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Security ── */}
        <SectionHeader title={t.security} />
        <View style={styles.card}>
          <View style={styles.securityRow}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityNote}>{t.securityNote}</Text>
          </View>
        </View>

        {/* ── About ── */}
        <SectionHeader title={t.about} />
        <View style={styles.card}>
          <SettingsRow
            label={t.version}
            value={APP_VERSION}
          />
          <SettingsRow
            label={t.privacyPolicy}
            onPress={() => Linking.openURL('https://your-domain.com/privacy')}
            chevron
          />
          <SettingsRow
            label={t.terms}
            onPress={() => Linking.openURL('https://your-domain.com/terms')}
            chevron
          />
          <SettingsRow
            label={t.contact}
            onPress={() => Linking.openURL('mailto:support@your-domain.com')}
            chevron
            last
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <Text style={styles.sectionHeader}>{title}</Text>
  );
}

function BenefitsColumn({
  title,
  items,
  active,
  highlight,
}: {
  title: string;
  items: string[];
  active: boolean;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.benefitsCol, highlight && styles.benefitsColHighlight]}>
      <Text style={[styles.benefitsTitle, highlight && styles.benefitsTitleHighlight]}>
        {title}
      </Text>
      {items.map((item, i) => (
        <Text key={i} style={[styles.benefitsItem, active && styles.benefitsItemActive]}>
          {active ? '✓ ' : '• '}{item}
        </Text>
      ))}
    </View>
  );
}

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
  last?: boolean;
}

function SettingsRow({ label, value, onPress, chevron, last }: SettingsRowProps) {
  const content = (
    <View style={[styles.settingsRow, last && styles.settingsRowLast]}>
      <Text style={styles.settingsRowLabel}>{label}</Text>
      <View style={styles.settingsRowRight}>
        {value && <Text style={styles.settingsRowValue}>{value}</Text>}
        {chevron && <Text style={styles.chevron}>›</Text>}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0f',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#e8e8f0',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4b5563',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  languageRowActive: {
    backgroundColor: 'rgba(99,102,241,0.08)',
  },
  languageFlag: {
    fontSize: 20,
  },
  languageLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#9ca3af',
  },
  languageLabelActive: {
    color: '#e8e8f0',
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  statusLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeFree: {
    borderColor: 'rgba(107,114,128,0.4)',
    backgroundColor: 'rgba(107,114,128,0.1)',
  },
  statusBadgePremium: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99,102,241,0.15)',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadgeTextFree: {
    color: '#6b7280',
  },
  statusBadgeTextPremium: {
    color: '#a5b4fc',
  },
  benefitsRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  benefitsCol: {
    flex: 1,
    gap: 6,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  benefitsColHighlight: {
    backgroundColor: 'rgba(99,102,241,0.06)',
    borderColor: 'rgba(99,102,241,0.25)',
  },
  benefitsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  benefitsTitleHighlight: {
    color: '#6366f1',
  },
  benefitsItem: {
    fontSize: 12,
    color: '#4b5563',
  },
  benefitsItemActive: {
    color: '#9ca3af',
  },
  subscribeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    margin: 14,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  subscribeBtnLoading: {
    opacity: 0.7,
  },
  subscribeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  subscribeBtnPrice: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 4,
  },
  restoreBtnText: {
    fontSize: 13,
    color: '#4b5563',
    textDecorationLine: 'underline',
  },
  alreadyPremium: {
    padding: 14,
    alignItems: 'center',
  },
  alreadyPremiumText: {
    fontSize: 13,
    color: '#a5b4fc',
    fontStyle: 'italic',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 10,
  },
  securityIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  securityNote: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingsRowLast: {
    borderBottomWidth: 0,
  },
  settingsRowLabel: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  settingsRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingsRowValue: {
    fontSize: 13,
    color: '#4b5563',
    fontVariant: ['tabular-nums'],
  },
  chevron: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '300',
  },
  benefitsDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});

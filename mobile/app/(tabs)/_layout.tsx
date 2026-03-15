import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useAppStore } from '../../src/store';

// Tab icon components (pure RN — no external icon library needed)
import { View, Text, StyleSheet } from 'react-native';

interface TabIconProps {
  focused: boolean;
  emoji: string;
  label: string;
}

function TabIcon({ focused, emoji, label }: TabIconProps) {
  return (
    <View style={iconStyles.container}>
      <Text style={[iconStyles.emoji, focused && iconStyles.emojiActive]}>{emoji}</Text>
      {focused && <View style={iconStyles.dot} />}
    </View>
  );
}

const iconStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  emoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  emojiActive: {
    opacity: 1,
  },
  dot: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
  },
});

const TAB_LABELS = {
  ko: {
    home: '시세',
    charts: '차트',
    alerts: '알림',
    settings: '설정',
  },
  en: {
    home: 'Prices',
    charts: 'Charts',
    alerts: 'Alerts',
    settings: 'Settings',
  },
  zh: {
    home: '价格',
    charts: '图表',
    alerts: '提醒',
    settings: '设置',
  },
} as const;

export default function TabsLayout() {
  const language = useAppStore((s) => s.language);
  const t = TAB_LABELS[language];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111118',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#4b5563',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.home,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="🌶️" label={t.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: t.charts,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="📈" label={t.charts} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: t.alerts,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="🔔" label={t.alerts} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.settings,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="⚙️" label={t.settings} />
          ),
        }}
      />
    </Tabs>
  );
}

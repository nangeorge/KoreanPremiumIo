import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SUPPORTED_COINS } from '../types';
import type { Language, SelectedExchange } from '../types';
import {
  validateAlertThreshold,
  validateCoinSymbol,
  sanitizeNumericInput,
  ALERT_THRESHOLD_MIN,
  ALERT_THRESHOLD_MAX,
} from '../utils/validate';

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: {
    symbol: string;
    threshold: number;
    direction: 'above' | 'below';
    exchange: SelectedExchange;
    enabled: boolean;
  }) => void;
  language: Language;
  selectedExchange: SelectedExchange;
}

const LABELS = {
  ko: {
    title: '알림 추가',
    selectCoin: '코인 선택',
    direction: '방향',
    above: '이상',
    below: '이하',
    threshold: '임계값 (%)',
    thresholdHint: `${ALERT_THRESHOLD_MIN}~${ALERT_THRESHOLD_MAX}% 사이 입력`,
    exchange: '거래소',
    binance: '바이낸스',
    coinbase: '코인베이스',
    cancel: '취소',
    add: '추가',
    validationError: '입력 오류',
  },
  en: {
    title: 'Add Alert',
    selectCoin: 'Select Coin',
    direction: 'Direction',
    above: 'Above',
    below: 'Below',
    threshold: 'Threshold (%)',
    thresholdHint: `Enter ${ALERT_THRESHOLD_MIN}–${ALERT_THRESHOLD_MAX}%`,
    exchange: 'Exchange',
    binance: 'Binance',
    coinbase: 'Coinbase',
    cancel: 'Cancel',
    add: 'Add',
    validationError: 'Validation Error',
  },
  zh: {
    title: '添加提醒',
    selectCoin: '选择币种',
    direction: '方向',
    above: '高于',
    below: '低于',
    threshold: '阈值 (%)',
    thresholdHint: `输入 ${ALERT_THRESHOLD_MIN}–${ALERT_THRESHOLD_MAX}%`,
    exchange: '交易所',
    binance: '币安',
    coinbase: 'Coinbase',
    cancel: '取消',
    add: '添加',
    validationError: '验证错误',
  },
} as const;

export function AlertModal({
  visible,
  onClose,
  onConfirm,
  language,
  selectedExchange,
}: AlertModalProps) {
  const t = LABELS[language];

  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [thresholdInput, setThresholdInput] = useState('');
  const [exchange, setExchange] = useState<SelectedExchange>(selectedExchange);
  const [thresholdError, setThresholdError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setSelectedSymbol('BTC');
    setDirection('above');
    setThresholdInput('');
    setExchange(selectedExchange);
    setThresholdError(null);
  }, [selectedExchange]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleThresholdChange = useCallback(
    (text: string) => {
      const sanitized = sanitizeNumericInput(text);
      setThresholdInput(sanitized);
      if (thresholdError) {
        const result = validateAlertThreshold(sanitized, language);
        if (result.valid) setThresholdError(null);
      }
    },
    [thresholdError, language],
  );

  const handleAdd = useCallback(() => {
    // Validate symbol
    const symbolResult = validateCoinSymbol(selectedSymbol);
    if (!symbolResult.valid) {
      Alert.alert(t.validationError, symbolResult.error);
      return;
    }

    // Validate threshold
    const thresholdResult = validateAlertThreshold(thresholdInput, language);
    if (!thresholdResult.valid) {
      setThresholdError(thresholdResult.error ?? null);
      return;
    }

    onConfirm({
      symbol: selectedSymbol,
      threshold: parseFloat(thresholdInput),
      direction,
      exchange,
      enabled: true,
    });
    reset();
    onClose();
  }, [selectedSymbol, thresholdInput, direction, exchange, language, t, onConfirm, reset, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>{t.cancel}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{t.title}</Text>
            <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
              <Text style={styles.addText}>{t.add}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            {/* Coin Selector */}
            <Text style={styles.sectionLabel}>{t.selectCoin}</Text>
            <View style={styles.chipGrid}>
              {SUPPORTED_COINS.map((coin) => (
                <TouchableOpacity
                  key={coin.symbol}
                  style={[
                    styles.chip,
                    selectedSymbol === coin.symbol && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedSymbol(coin.symbol)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedSymbol === coin.symbol && styles.chipTextSelected,
                    ]}
                  >
                    {coin.symbol}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Direction */}
            <Text style={styles.sectionLabel}>{t.direction}</Text>
            <View style={styles.segmentRow}>
              <TouchableOpacity
                style={[
                  styles.segment,
                  direction === 'above' && styles.segmentActive,
                ]}
                onPress={() => setDirection('above')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    direction === 'above' && styles.segmentTextActive,
                  ]}
                >
                  ↑ {t.above}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segment,
                  direction === 'below' && styles.segmentActive,
                ]}
                onPress={() => setDirection('below')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    direction === 'below' && styles.segmentTextActive,
                  ]}
                >
                  ↓ {t.below}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Threshold Input */}
            <Text style={styles.sectionLabel}>{t.threshold}</Text>
            <View
              style={[
                styles.inputContainer,
                thresholdError && styles.inputContainerError,
              ]}
            >
              <TextInput
                style={styles.input}
                value={thresholdInput}
                onChangeText={handleThresholdChange}
                placeholder={t.thresholdHint}
                placeholderTextColor="#4b5563"
                keyboardType="decimal-pad"
                returnKeyType="done"
                maxLength={8}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
            {thresholdError && (
              <Text style={styles.errorText}>{thresholdError}</Text>
            )}

            {/* Exchange Selector */}
            <Text style={styles.sectionLabel}>{t.exchange}</Text>
            <View style={styles.segmentRow}>
              <TouchableOpacity
                style={[
                  styles.segment,
                  exchange === 'binance' && styles.segmentActive,
                ]}
                onPress={() => setExchange('binance')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    exchange === 'binance' && styles.segmentTextActive,
                  ]}
                >
                  {t.binance}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segment,
                  exchange === 'coinbase' && styles.segmentActive,
                ]}
                onPress={() => setExchange('coinbase')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    exchange === 'coinbase' && styles.segmentTextActive,
                  ]}
                >
                  {t.coinbase}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom padding */}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#e8e8f0',
  },
  cancelBtn: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
  },
  addBtn: {
    padding: 4,
  },
  addText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 10,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipSelected: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99,102,241,0.18)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  chipTextSelected: {
    color: '#6366f1',
  },
  segmentRow: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  segmentActive: {
    backgroundColor: 'rgba(99,102,241,0.2)',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  segmentTextActive: {
    color: '#a5b4fc',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 14,
  },
  inputContainerError: {
    borderColor: '#ef4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#e8e8f0',
    paddingVertical: 12,
    fontVariant: ['tabular-nums'],
  },
  inputSuffix: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
  },
});

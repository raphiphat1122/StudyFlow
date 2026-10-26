import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View, AccessibilityInfo, ScrollView, type StyleProp, type ViewStyle, type TextInputProps } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOutLeft, ReduceMotion, ZoomIn, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/features/store';
import { font, radius, space } from '@/theme';
import { mascot, type MascotName } from '@/constants/assets';

const AP = Animated.createAnimatedComponent(Pressable);
export function PressableScale({ children, style, onPress, label, disabled }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; label?: string; disabled?: boolean }) {
  const s = useSharedValue(1); const reduce = useReducedMotion();
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return <AP accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress}
    onPressIn={() => { if (!reduce) s.value = withTiming(0.95, { duration: 90 }); }} onPressOut={() => { s.value = reduce ? 1 : withSpring(1, { damping: 11, stiffness: 240 }); }}
    style={[{ minHeight: 44 }, style, a]}>{children}</AP>;
}
export function AppText({ children, size = 15, weight = 'regular', color, style, numberOfLines }: { children: React.ReactNode; size?: number; weight?: keyof typeof font; color?: string; style?: StyleProp<any>; numberOfLines?: number }) {
  const { colors } = useApp(); return <Text numberOfLines={numberOfLines} style={[{ fontFamily: font[weight], fontSize: size, color: color ?? colors.text }, style]}>{children}</Text>;
}
export function Button({ title, onPress, variant = 'primary', style }: { title: string; onPress: () => void; variant?: 'primary' | 'ghost' | 'danger'; style?: StyleProp<ViewStyle> }) {
  const { colors } = useApp();
  const bg = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : 'transparent';
  const fg = variant === 'ghost' ? colors.primary : colors.onPrimary;
  return <PressableScale label={title} onPress={onPress} style={[{ backgroundColor: bg, borderRadius: radius.pill, paddingHorizontal: space.lg, justifyContent: 'center', alignItems: 'center', minHeight: 48 }, style]}>
    <AppText weight="semibold" color={fg}>{title}</AppText></PressableScale>;
}
export function Card({ children, style, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const { colors } = useApp();
  const { flex, ...rest } = (StyleSheet.flatten(style) || {}) as ViewStyle;
  const base: ViewStyle = { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space.md, shadowColor: '#8B5CF6', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 };
  const inner = onPress ? <PressableScale onPress={onPress} style={[base, rest]}>{children}</PressableScale> : <View style={[base, rest]}>{children}</View>;
  return (
    <Animated.View
      entering={FadeInDown.duration(260).reduceMotion(ReduceMotion.System)}
      exiting={FadeOutLeft.duration(200).reduceMotion(ReduceMotion.System)}
      style={flex !== undefined ? { flex } : undefined}
    >
      {inner}
    </Animated.View>
  );
}
export function Mascot({ name, size = 140 }: { name: MascotName; size?: number }) {
  const src: any = mascot[name];
  const meta: any =
    typeof Image.resolveAssetSource === 'function'
      ? Image.resolveAssetSource(src)
      : src && typeof src === 'object'
        ? src
        : undefined;
  const ratio = meta?.width && meta?.height ? meta.height / meta.width : 1;
  return <Image source={src} accessibilityIgnoresInvertColors style={{ width: size, height: size * ratio }} resizeMode="contain" />;
}
export function EmptyState({ mascotName, title, action }: { mascotName: MascotName; title: string; action?: { title: string; onPress: () => void } }) {
  return <View style={{ alignItems: 'center', padding: space.lg, gap: space.md }}><Mascot name={mascotName} size={150} /><AppText weight="medium">{title}</AppText>
    {action && <Button title={action.title} onPress={action.onPress} />}</View>;
}
export function Screen({ title, children, right, scroll = true }: { title: string; children: React.ReactNode; right?: React.ReactNode; scroll?: boolean }) {
  const { colors } = useApp(); const insets = useSafeAreaInsets();
  const Body: any = scroll ? ScrollView : View;
  return <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.md, paddingVertical: space.sm }}>
      <AppText size={24} weight="bold" color={colors.primary}>{title}</AppText>{right}</View>
    <Body style={{ flex: 1 }} contentContainerStyle={scroll ? { padding: space.md, gap: space.md, paddingBottom: space.xl } : undefined} keyboardShouldPersistTaps="handled">{children}</Body></View>;
}
export function Field({ label, error, ...p }: TextInputProps & { label: string; error?: string }) {
  const { colors } = useApp();
  return <View style={{ gap: 4 }}><AppText size={13} weight="medium" color={colors.muted}>{label}</AppText>
    <TextInput placeholderTextColor={colors.muted} {...p} accessibilityLabel={label}
      style={{ fontFamily: font.regular, fontSize: 15, color: colors.text, backgroundColor: colors.card, borderWidth: 1, borderColor: error ? colors.danger : colors.border, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: 12, minHeight: 48 }} />
    {!!error && <AppText size={12} color={colors.danger}>{error}</AppText>}</View>;
}
export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors } = useApp();
  return <PressableScale onPress={onPress} label={label} style={{ paddingHorizontal: 14, borderRadius: radius.pill, justifyContent: 'center', backgroundColor: active ? colors.primary : colors.soft }}>
    <AppText size={13} weight="medium" color={active ? colors.onPrimary : colors.text}>{label}</AppText></PressableScale>;
}
export function ConfirmDialog({ visible, message, confirmLabel, cancelLabel, danger, onConfirm, onCancel }: { visible: boolean; message: string; confirmLabel: string; cancelLabel: string; danger?: boolean; onConfirm: () => void; onCancel: () => void }) {
  const { colors } = useApp();
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <Animated.View entering={FadeIn.duration(150).reduceMotion(ReduceMotion.System)} style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', padding: space.lg }}>
        <Animated.View entering={ZoomIn.duration(180).reduceMotion(ReduceMotion.System)} style={{ backgroundColor: colors.card, borderRadius: radius.lg, padding: space.lg, gap: space.md }}>
          <AppText weight="medium">{message}</AppText>
          <View style={{ flexDirection: 'row', gap: space.sm, justifyContent: 'flex-end' }}>
            <Button title={cancelLabel} variant="ghost" onPress={onCancel} />
            <Button title={confirmLabel} variant={danger ? 'danger' : 'primary'} onPress={onConfirm} />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
void AccessibilityInfo; void StyleSheet;

import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation } from 'expo-router';

export function useUnsavedGuard(dirty: boolean, message: string, discard: string, cancel: string) {
  const nav: any = useNavigation();
  useEffect(
    () =>
      nav.addListener('beforeRemove', (e: any) => {
        if (!dirty) return;
        e.preventDefault();
        if (Platform.OS === 'web') {
          if (window.confirm(message)) nav.dispatch(e.data.action);
          return;
        }
        Alert.alert('', message, [
          { text: cancel, style: 'cancel' },
          { text: discard, style: 'destructive', onPress: () => nav.dispatch(e.data.action) },
        ]);
      }),
    [nav, dirty, message, discard, cancel],
  );
}

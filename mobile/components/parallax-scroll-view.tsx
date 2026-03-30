import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 150; // Réduit pour un look plus "Bancaire/Professionnel"

type Props = PropsWithChildren<{
  headerImage?: ReactElement; // Optionnel maintenant
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function SimpleScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <ScrollView style={{ backgroundColor, flex: 1 }}>
      {/* Header simple sans animation */}
      <View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
        ]}>
        {headerImage}
      </View>
      
      <ThemedView style={styles.content}>
        {children}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
    overflow: 'hidden',
    borderTopLeftRadius: 20, // Petit arrondi pour le style moderne
    borderTopRightRadius: 20,
    marginTop: -20, // Fait chevaucher le contenu sur le header
    backgroundColor: '#fff', // Ou utilisez useThemeColor
  },
});
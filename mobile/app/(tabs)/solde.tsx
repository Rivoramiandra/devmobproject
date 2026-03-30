import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

export default function SoldeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Données simulées (à remplacer par vos données réelles)
  const totalBalance = 15000.00;
  const minMaxData = [
    { id: 1, label: "Solde minimal", amount: 400.00, date: "2025-03-25", type: "debit" },
    { id: 2, label: "Solde maximal", amount: 8500.00, date: "2025-03-28", type: "credit" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête avec bouton retour et icône profil */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileImage}>
            <Ionicons name="person-circle" size={48} color={isDark ? "#BB86FC" : "#6200ee"} />
          </TouchableOpacity>
        </View>

        {/* Carte du solde total */}
        <View style={[styles.balanceCard, { backgroundColor: isDark ? '#1e1e1e' : '#f0f0f3' }]}>
          <ThemedText style={styles.balanceLabel}>Solde total</ThemedText>
          <ThemedText style={styles.balanceAmount}>{formatCurrency(totalBalance)}</ThemedText>
          <View style={styles.balanceFooter}>
            <ThemedText style={styles.balanceSubtext}>Dernière mise à jour : aujourd'hui</ThemedText>
          </View>
        </View>

        {/* Liste détaillée des soldes min et max */}
        <View style={styles.recentSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Soldes extrêmes
          </ThemedText>
          {minMaxData.map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons
                  name={item.type === 'credit' ? 'arrow-up-circle' : 'arrow-down-circle'}
                  size={32}
                  color={item.type === 'credit' ? '#4caf50' : '#f44336'}
                />
              </View>
              <View style={styles.transactionDetails}>
                <ThemedText style={styles.transactionLabel}>{item.label}</ThemedText>
                <ThemedText style={styles.transactionDate}>{item.date}</ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.transactionAmount,
                  { color: item.type === 'credit' ? '#4caf50' : '#f44336' }
                ]}
              >
                {item.type === 'credit' ? '+' : '-'} {formatCurrency(item.amount)}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceSubtext: {
    fontSize: 12,
    opacity: 0.6,
  },
  recentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
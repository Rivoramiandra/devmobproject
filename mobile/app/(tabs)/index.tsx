import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Données simulées
  const totalBalance = 45200.50;
  const recentTransactions = [
    { id: 1, label: "Dépôt", amount: 500, date: "2025-03-30", type: "credit" },
    { id: 2, label: "Retrait", amount: 120, date: "2025-03-29", type: "debit" },
    { id: 3, label: "Virement reçu", amount: 75, date: "2025-03-28", type: "credit" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section profil (seulement l’icône à droite) */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileImage}>
            <Ionicons name="person-circle" size={48} color={isDark ? "#BB86FC" : "#6200ee"} />
          </TouchableOpacity>
        </View>

        {/* Carte solde */}
        <View style={[styles.balanceCard, { backgroundColor: isDark ? '#1e1e1e' : '#f0f0f3' }]}>
          <ThemedText style={styles.balanceLabel}>Solde total</ThemedText>
          <ThemedText style={styles.balanceAmount}>{formatCurrency(totalBalance)}</ThemedText>
          <View style={styles.balanceFooter}>
            <ThemedText style={styles.balanceSubtext}>Dernière mise à jour : aujourd'hui</ThemedText>
          </View>
        </View>

        {/* Actions rapides avec navigation */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/explore')}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
              <Ionicons name="people-outline" size={28} color={isDark ? "#BB86FC" : "#6200ee"} />
            </View>
            <ThemedText style={styles.actionLabel}>Clients</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/solde')}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
              <Ionicons name="eye-outline" size={28} color={isDark ? "#BB86FC" : "#6200ee"} />
            </View>
            <ThemedText style={styles.actionLabel}>Observation</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/stats')}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
              <Ionicons name="bar-chart-outline" size={28} color={isDark ? "#BB86FC" : "#6200ee"} />
            </View>
            <ThemedText style={styles.actionLabel}>Statistiques</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Activité récente */}
        <View style={styles.recentSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Activité récente</ThemedText>
          {recentTransactions.map((tx) => (
            <View key={tx.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons
                  name={tx.type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle'}
                  size={32}
                  color={tx.type === 'credit' ? '#4caf50' : '#f44336'}
                />
              </View>
              <View style={styles.transactionDetails}>
                <ThemedText style={styles.transactionLabel}>{tx.label}</ThemedText>
                <ThemedText style={styles.transactionDate}>{tx.date}</ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.transactionAmount,
                  { color: tx.type === 'credit' ? '#4caf50' : '#f44336' }
                ]}
              >
                {tx.type === 'credit' ? '+' : '-'} {formatCurrency(tx.amount)}
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
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
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
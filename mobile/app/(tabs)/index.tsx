import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

type RecentAction = {
  id: number;
  label: string;
  date: string;
  icon: string;
  color: string;
  numCompte: string;
  nom: string;
  solde: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Données simulées – actions récentes avec détails client
  const recentActions: RecentAction[] = [
    {
      id: 1,
      label: 'Ajout client',
      date: '2025-03-30',
      icon: 'person-add-outline',
      color: '#4caf50',
      numCompte: 'FR76 1234 5678 9012 3456',
      nom: 'Sophie Martin',
      solde: 1250.00,
    },
    {
      id: 2,
      label: 'Modification client',
      date: '2025-03-29',
      icon: 'create-outline',
      color: '#ff9800',
      numCompte: 'FR76 9876 5432 1098 7654',
      nom: 'Lucas Bernard',
      solde: 3420.50,
    },
    {
      id: 3,
      label: 'Suppression client',
      date: '2025-03-28',
      icon: 'trash-outline',
      color: '#f44336',
      numCompte: 'FR76 4567 8901 2345 6789',
      nom: 'Emma Petit',
      solde: 780.00,
    },
  ];

  const totalBalance = 45200.50;

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

        {/* Activité récente avec détails client */}
        <View style={styles.recentSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Activité récente</ThemedText>
          {recentActions.map((action) => (
            <View key={action.id} style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon} size={32} color={action.color} />
              </View>
              <View style={styles.actionDetails}>
                <View style={styles.actionHeader}>
                  <ThemedText style={styles.actionLabel}>{action.label}</ThemedText>
                  <ThemedText style={styles.actionDate}>{action.date}</ThemedText>
                </View>
                <View style={styles.clientDetails}>
                  <ThemedText style={styles.clientInfo}>
                    {action.nom} • {action.numCompte}
                  </ThemedText>
                  <ThemedText style={styles.clientBalance}>
                    {formatCurrency(action.solde)}
                  </ThemedText>
                </View>
              </View>
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
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  actionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  actionDetails: {
    flex: 1,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  clientDetails: {
    marginTop: 2,
  },
  clientInfo: {
    fontSize: 13,
    opacity: 0.7,
  },
  clientBalance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6200ee',
    marginTop: 2,
  },
});
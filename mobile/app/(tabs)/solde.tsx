import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const API_BASE_URL = Platform.select({
  android: 'http://192.168.137.128:8000/api',
  ios: 'http://192.168.137.128:8000/api',
  default: 'http://localhost:8000/api',
});

type Client = {
  id: number;
  num_compte: string;
  nom: string;
  solde: number;
};

export default function SoldeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clients`);
      if (!response.ok) throw new Error('Erreur lors du chargement des clients');
      const data = await response.json();
      setClients(data);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de charger les clients');
    } finally {
      setLoading(false);
    }
  };

  // Recharger les données chaque fois que l'écran est affiché (focus)
  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [])
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(amount);
  };

  // Calculs statistiques
  const totalBalance = clients.reduce((sum, c) => sum + Number(c.solde), 0);
  const minClient = clients.length > 0
    ? clients.reduce((min, c) => (Number(c.solde) < Number(min.solde) ? c : min), clients[0])
    : null;
  const maxClient = clients.length > 0
    ? clients.reduce((max, c) => (Number(c.solde) > Number(max.solde) ? c : max), clients[0])
    : null;

  // Date du jour pour l'affichage
  const today = new Date().toLocaleDateString('fr-FR');

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

        {loading ? (
          <ActivityIndicator size="large" color={isDark ? '#BB86FC' : '#6200ee'} style={styles.loader} />
        ) : clients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Aucun client trouvé</ThemedText>
          </View>
        ) : (
          <>
            {/* Carte du solde total */}
            <View style={[styles.balanceCard, { backgroundColor: isDark ? '#1e1e1e' : '#f0f0f3' }]}>
              <ThemedText style={styles.balanceLabel}>Solde total</ThemedText>
              <ThemedText style={styles.balanceAmount}>{formatCurrency(totalBalance)}</ThemedText>
              <View style={styles.balanceFooter}>
                <ThemedText style={styles.balanceSubtext}>Dernière mise à jour : {today}</ThemedText>
              </View>
            </View>

            {/* Liste détaillée des soldes extrêmes */}
            <View style={styles.recentSection}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Soldes extrêmes
              </ThemedText>

              {/* Client avec le solde minimal */}
              {minClient && (
                <View style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Ionicons
                      name="arrow-down-circle"
                      size={32}
                      color="#f44336"
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <ThemedText style={styles.transactionLabel}>Solde minimal</ThemedText>
                    <ThemedText style={styles.clientInfo}>
                      {minClient.nom} • {minClient.num_compte}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.transactionAmount, { color: '#f44336' }]}>
                    {formatCurrency(Number(minClient.solde))}
                  </ThemedText>
                </View>
              )}

              {/* Client avec le solde maximal */}
              {maxClient && (
                <View style={styles.transactionItem}>
                  <View style={styles.transactionIcon}>
                    <Ionicons
                      name="arrow-up-circle"
                      size={32}
                      color="#4caf50"
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <ThemedText style={styles.transactionLabel}>Solde maximal</ThemedText>
                    <ThemedText style={styles.clientInfo}>
                      {maxClient.nom} • {maxClient.num_compte}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.transactionAmount, { color: '#4caf50' }]}>
                    {formatCurrency(Number(maxClient.solde))}
                  </ThemedText>
                </View>
              )}
            </View>
          </>
        )}
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
    fontSize: 30,
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
  clientInfo: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
});
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
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
import { BarChart } from 'react-native-chart-kit';

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

export default function StatsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const screenWidth = Dimensions.get('window').width;

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
  const soldes = clients.map(c => Number(c.solde));
  const total = soldes.reduce((a, b) => a + b, 0);
  const min = soldes.length > 0 ? Math.min(...soldes) : 0;
  const max = soldes.length > 0 ? Math.max(...soldes) : 0;

  // Données pour l'histogramme à trois barres
  const barChartData = {
    labels: ['Total', 'Min', 'Max'],
    datasets: [{ data: [total, min, max] }],
  };

  // Configuration du graphique en fonction du thème
  const chartConfig = {
    backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
    backgroundGradientFrom: isDark ? '#1e1e1e' : '#ffffff',
    backgroundGradientTo: isDark ? '#1e1e1e' : '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${isDark ? '255,255,255' : '0,0,0'}, ${opacity})`,
    style: { borderRadius: 16 },
    propsForLabels: { fontSize: 12 },
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileImage}>
            <Ionicons name="person-circle" size={48} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
        </View>
        <ActivityIndicator size="large" color={isDark ? '#BB86FC' : '#6200ee'} style={styles.loader} />
      </ThemedView>
    );
  }

  if (clients.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileImage}>
            <Ionicons name="person-circle" size={48} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Aucun client trouvé</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* En-tête avec bouton retour et icône profil */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileImage}>
            <Ionicons name="person-circle" size={48} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
        </View>

        {/* Cartes récapitulatives */}
        <View style={[styles.balanceCard, { backgroundColor: isDark ? '#1e1e1e' : '#f0f0f3' }]}>
          <ThemedText style={styles.balanceLabel}>Solde total</ThemedText>
          <ThemedText style={styles.balanceAmount}>{formatCurrency(total)}</ThemedText>
          <View style={styles.balanceFooter}>
            <ThemedText style={styles.balanceSubtext}>Basé sur {clients.length} clients</ThemedText>
          </View>
        </View>

        <View style={styles.rowStats}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
            <Ionicons name="trending-down-outline" size={24} color={isDark ? '#BB86FC' : '#6200ee'} />
            <ThemedText style={styles.statLabel}>Minimum</ThemedText>
            <ThemedText style={styles.statValue}>{formatCurrency(min)}</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
            <Ionicons name="trending-up-outline" size={24} color={isDark ? '#BB86FC' : '#6200ee'} />
            <ThemedText style={styles.statLabel}>Maximum</ThemedText>
            <ThemedText style={styles.statValue}>{formatCurrency(max)}</ThemedText>
          </View>
        </View>

        {/* Graphique en histogramme avec trois barres */}
        <View style={styles.chartSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Aperçu des soldes
          </ThemedText>
          <View style={[styles.chartCard, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
            <BarChart
              data={barChartData}
              width={screenWidth - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix="Ar"
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              fromZero
              showBarTops={false}
              style={styles.chart}
            />
          </View>
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
  scrollContent: {
    paddingBottom: 80,
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
    marginBottom: 20,
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
  rowStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  chartCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
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
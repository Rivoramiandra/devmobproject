import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { BarChart, PieChart } from 'react-native-chart-kit';

// Données simulées (à remplacer par vos données réelles)
const mockData = [
  { id: 1, nom: 'Client A', solde: 1200 },
  { id: 2, nom: 'Client B', solde: 4500 },
  { id: 3, nom: 'Client C', solde: 800 },
  { id: 4, nom: 'Client D', solde: 5500 },
];

export default function StatsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const screenWidth = Dimensions.get('window').width;

  // Calculs statistiques
  const soldes = mockData.map(c => c.solde);
  const total = soldes.reduce((a, b) => a + b, 0);
  const min = Math.min(...soldes);
  const max = Math.max(...soldes);

  // Données pour l'histogramme
  const barChartData = {
    labels: mockData.map(c => c.nom),
    datasets: [{ data: soldes }],
  };

  // Données pour le camembert
  const pieChartData = mockData.map(client => ({
    name: client.nom,
    amount: client.solde,
    color: `hsl(${client.id * 90}, 70%, 60%)`, // Couleurs dynamiques
    legendFontColor: isDark ? '#fff' : '#000',
    legendFontSize: 12,
  }));

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

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
            <ThemedText style={styles.balanceSubtext}>Basé sur {mockData.length} clients</ThemedText>
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

        {/* Graphique en histogramme */}
        <View style={styles.chartSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Comparaison des soldes
          </ThemedText>
          <View style={[styles.chartCard, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
            <BarChart
              data={barChartData}
              width={screenWidth - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix="€"
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero
              showBarTops={false}
              style={styles.chart}
            />
          </View>
        </View>

        {/* Graphique en camembert */}
        <View style={styles.chartSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Répartition des soldes
          </ThemedText>
          <View style={[styles.chartCard, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
            <PieChart
              data={pieChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
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
    paddingBottom: 80, // Espace en bas pour ne pas être caché par la barre de navigation
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
});
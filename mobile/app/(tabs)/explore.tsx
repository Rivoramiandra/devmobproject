// app/(tabs)/explore.tsx
import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AddClientModal from '@/components/AddClientModal';
import EditClientModal from '@/components/EditClientModal';

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

const getObservation = (solde: number): { label: string; color: string } => {
  if (solde < 1000) return { label: 'Insuffisant', color: '#F44336' };
  if (solde <= 5000) return { label: 'Moyen', color: '#FF9800' };
  return { label: 'Élevé', color: '#4CAF50' };
};

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

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

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchText.toLowerCase()) ||
    client.num_compte.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA' }).format(amount);
  };

  const totalSolde = clients.reduce((sum, c) => sum + Number(c.solde), 0);
  const minSolde = clients.length > 0 ? Math.min(...clients.map(c => Number(c.solde))) : 0;
  const maxSolde = clients.length > 0 ? Math.max(...clients.map(c => Number(c.solde))) : 0;

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setEditModalVisible(true);
  };

  const handleDeleteClient = async (id: number) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer ce client ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
                method: 'DELETE',
              });
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la suppression');
              }
              console.log('✅ Client supprimé :', id);
              await fetchClients();
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  const handleSearchAction = () => {
    if (isSearchVisible) {
      Animated.timing(searchAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsSearchVisible(false);
        setSearchText('');
      });
    } else {
      setIsSearchVisible(true);
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleCloseSearch = () => {
    Animated.timing(searchAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsSearchVisible(false);
      setSearchText('');
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}  // ← Ajout de flex: 1 pour permettre le scroll
      >
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileImage}>
            <Ionicons name="person-circle" size={48} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
              <Ionicons name="add-circle-outline" size={28} color={isDark ? '#BB86FC' : '#6200ee'} />
            </View>
            <ThemedText style={styles.actionLabel}>Ajouter</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
              <Ionicons name="eye-outline" size={28} color={isDark ? '#BB86FC' : '#6200ee'} />
            </View>
            <ThemedText style={styles.actionLabel}>Observation</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleSearchAction}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
              <Ionicons name="search-outline" size={28} color={isDark ? '#BB86FC' : '#6200ee'} />
            </View>
            <ThemedText style={styles.actionLabel}>Recherche</ThemedText>
          </TouchableOpacity>
        </View>

        {isSearchVisible && (
          <Animated.View
            style={[
              styles.searchContainer,
              {
                opacity: searchAnim,
                transform: [{
                  translateY: searchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#2c2c2c' : '#f0f0f0' }
                ]}
                placeholder="Rechercher un client..."
                placeholderTextColor="#888"
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#888" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleCloseSearch} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        <View style={styles.clientsSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Liste des clients {searchText ? `(${filteredClients.length} résultat(s))` : `(${clients.length})`}
          </ThemedText>

          {loading ? (
            <ActivityIndicator size="large" color={isDark ? '#BB86FC' : '#6200ee'} style={styles.loader} />
          ) : filteredClients.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>Aucun client trouvé</ThemedText>
            </View>
          ) : (
            filteredClients.map((client) => {
              const obs = getObservation(Number(client.solde));
              return (
                <View key={client.id} style={styles.clientItem}>
                  <View style={styles.clientIcon}>
                    <Ionicons name="person-outline" size={32} color={obs.color} />
                  </View>
                  <View style={styles.clientDetails}>
                    <View style={styles.clientHeader}>
                      <ThemedText style={styles.clientName}>{client.nom}</ThemedText>
                      <View style={styles.clientActions}>
                        <TouchableOpacity onPress={() => handleEditClient(client)} style={styles.actionIcon}>
                          <Ionicons name="create-outline" size={24} color="#4CAF50" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteClient(client.id)} style={styles.actionIcon}>
                          <Ionicons name="trash-outline" size={24} color="#F44336" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.clientInfo}>
                      <ThemedText style={styles.clientCompte}>N° {client.num_compte}</ThemedText>
                      <ThemedText style={styles.clientSolde}>
                        {formatCurrency(Number(client.solde))}
                      </ThemedText>
                      <View style={[styles.obsBadge, { backgroundColor: obs.color + '22' }]}>
                        <ThemedText style={[styles.obsText, { color: obs.color }]}>
                          {obs.label}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {!loading && clients.length > 0 && (
          <View style={[styles.statsContainer, { backgroundColor: isDark ? '#2c2c2c' : '#f5f5f5' }]}>
            <ThemedText style={styles.statsTitle}>📊 Statistiques</ThemedText>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Total</ThemedText>
                <ThemedText style={[styles.statValue, { color: '#6200ee' }]}>
                  {formatCurrency(totalSolde)}
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Minimum</ThemedText>
                <ThemedText style={[styles.statValue, { color: '#F44336' }]}>
                  {formatCurrency(minSolde)}
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Maximum</ThemedText>
                <ThemedText style={[styles.statValue, { color: '#4CAF50' }]}>
                  {formatCurrency(maxSolde)}
                </ThemedText>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <AddClientModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddSuccess={fetchClients}
      />

      <EditClientModal
        visible={editModalVisible}
        client={selectedClient}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedClient(null);
        }}
        onEditSuccess={fetchClients}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: { padding: 4 },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchContainer: { marginBottom: 20 },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingLeft: 40,
    paddingRight: 80,
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 48,
    padding: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    padding: 8,
  },
  clientsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  clientIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  clientDetails: {
    flex: 1,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
  },
  clientActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginLeft: 16,
    padding: 4,
  },
  clientInfo: {
    marginTop: 2,
  },
  clientCompte: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 2,
  },
  clientSolde: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6200ee',
    marginTop: 2,
  },
  obsBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  obsText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
  },
  loader: { marginVertical: 40 },
  statsContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
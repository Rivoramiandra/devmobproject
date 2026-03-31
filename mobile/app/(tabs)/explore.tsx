import { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AddClientModal from '@/components/AddClientModal';

type Client = {
  id: number;
  name: string;
  email: string;
  total: number;
};

export default function ExploreScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Données simulées – liste de clients (state mutable)
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Sophie Martin', email: 'sophie.martin@email.com', total: 1250.00 },
    { id: 2, name: 'Lucas Bernard', email: 'lucas.bernard@email.com', total: 3420.50 },
    { id: 3, name: 'Emma Petit', email: 'emma.petit@email.com', total: 780.00 },
    { id: 4, name: 'Thomas Durand', email: 'thomas.durand@email.com', total: 2150.75 },
  ]);

  // États pour la recherche
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchAnim = useRef(new Animated.Value(0)).current;

  // État du modal
  const [modalVisible, setModalVisible] = useState(false);

  // Filtrage des clients
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchText.toLowerCase()) ||
    client.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Handlers
  const handleEditClient = (id: number) => {
    console.log('Modifier client', id);
    // À implémenter : ouvrir un modal de modification
  };

  const handleDeleteClient = (id: number) => {
    console.log('Supprimer client', id);
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const handleAddAction = () => {
    setModalVisible(true);
  };

  const handleObservationAction = () => {
    console.log('Action Observation');
  };

  const handleSearchAction = () => {
    if (isSearchVisible) {
      // Fermer la recherche et réinitialiser le texte
      Animated.timing(searchAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsSearchVisible(false);
        setSearchText('');
      });
    } else {
      // Ouvrir la recherche
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

  // Ajout d'un client
  const handleAddClient = (newClient: Omit<Client, 'id'>) => {
    const newId = Math.max(0, ...clients.map(c => c.id)) + 1;
    setClients([...clients, { id: newId, ...newClient }]);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section profil avec bouton retour */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={28} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileImage}>
            <Ionicons name="person-circle" size={48} color={isDark ? '#BB86FC' : '#6200ee'} />
          </TouchableOpacity>
        </View>

        {/* 3 boutons d'action */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleAddAction}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
              <Ionicons name="add-circle-outline" size={28} color={isDark ? '#BB86FC' : '#6200ee'} />
            </View>
            <ThemedText style={styles.actionLabel}>Ajouter</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleObservationAction}>
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

        {/* Champ de recherche animé */}
        {isSearchVisible && (
          <Animated.View
            style={[
              styles.searchContainer,
              {
                opacity: searchAnim,
                transform: [
                  {
                    translateY: searchAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
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

        {/* Liste des clients */}
        <View style={styles.clientsSection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Liste des clients {searchText ? `(${filteredClients.length} résultat(s))` : ''}
          </ThemedText>
          {filteredClients.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>Aucun client trouvé</ThemedText>
            </View>
          ) : (
            filteredClients.map((client) => (
              <View key={client.id} style={styles.clientItem}>
                <View style={styles.clientInfo}>
                  <ThemedText style={styles.clientName}>{client.name}</ThemedText>
                  <ThemedText style={styles.clientEmail}>{client.email}</ThemedText>
                  <ThemedText style={styles.clientTotal}>
                    {formatCurrency(client.total)}
                  </ThemedText>
                </View>
                <View style={styles.clientActions}>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleEditClient(client.id)}
                  >
                    <Ionicons name="create-outline" size={24} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIcon}
                    onPress={() => handleDeleteClient(client.id)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal d'ajout de client */}
      <AddClientModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddClient}
        nextId={Math.max(0, ...clients.map(c => c.id)) + 1}
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
  backButton: {
    padding: 4,
    marginRight: 8,
  },
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
  searchContainer: {
    marginBottom: 20,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    position: 'relative',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
  },
  clientEmail: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  clientTotal: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    color: '#6200ee',
  },
  clientActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: 16,
    padding: 4,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
  },
});
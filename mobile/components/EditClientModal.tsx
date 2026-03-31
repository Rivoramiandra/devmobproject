// components/EditClientModal.tsx
import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

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

type EditClientModalProps = {
  visible: boolean;
  client: Client | null;
  onClose: () => void;
  onEditSuccess: () => void;
};

export default function EditClientModal({ visible, client, onClose, onEditSuccess }: EditClientModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [numCompte, setNumCompte] = useState('');
  const [nom, setNom] = useState('');
  const [solde, setSolde] = useState('');
  const [loading, setLoading] = useState(false);

  // Pré-remplir le formulaire avec les données du client
  useEffect(() => {
    if (client) {
      setNumCompte(client.num_compte);
      setNom(client.nom);
      setSolde(String(client.solde));
    }
  }, [client]);

  const handleEdit = async () => {
    if (!numCompte.trim() || !nom.trim() || !solde.trim()) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
    const montant = parseFloat(solde);
    if (isNaN(montant) || montant <= 0) {
      Alert.alert('Erreur', 'Solde invalide (doit être un nombre positif).');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${client?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numCompte: numCompte.trim(),
          nom: nom.trim(),
          solde: montant,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification');
      }

      const updatedClient = await response.json();
      console.log('✅ Client modifié :', updatedClient);

      onEditSuccess();
      onClose();
    } catch (error: any) {
      console.error('🚨 Erreur modification :', error);
      Alert.alert('Erreur', error.message || "Impossible de modifier le client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Modifier le client</ThemedText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: '#ccc' }]}
            placeholder="Numéro de compte"
            placeholderTextColor="#888"
            value={numCompte}
            onChangeText={setNumCompte}
          />
          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: '#ccc' }]}
            placeholder="Nom complet"
            placeholderTextColor="#888"
            value={nom}
            onChangeText={setNom}
          />
          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: '#ccc' }]}
            placeholder="Solde (Ar)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={solde}
            onChangeText={setSolde}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.cancelText}>Annuler</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleEdit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <ThemedText style={styles.saveText}>Enregistrer</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelText: {
    fontWeight: 'bold',
    opacity: 0.6,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
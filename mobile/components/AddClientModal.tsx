// components/AddClientModal.tsx
import { useState } from 'react';
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

// URL automatique selon la plateforme
const API_BASE_URL = Platform.select({
  android: 'http://192.168.137.128:8000/api', // téléphone physique Android
  ios: 'http://192.168.137.128:8000/api',     // téléphone physique iOS
  default: 'http://localhost:8000/api',        // navigateur web
});

type AddClientModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
};

export default function AddClientModal({ visible, onClose, onAddSuccess }: AddClientModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [numCompte, setNumCompte] = useState('');
  const [nom, setNom] = useState('');
  const [solde, setSolde] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNumCompte('');
    setNom('');
    setSolde('');
  };

  const handleAdd = async () => {
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
      const requestBody = {
        numCompte: numCompte.trim(),
        nom: nom.trim(),
        solde: montant,
      };
      console.log('📤 Envoi à', `${API_BASE_URL}/clients`, requestBody);

      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('❌ Erreur serveur :', {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            data: errorData,
          });
        } catch (parseError) {
          console.error("⚠️ Impossible de parser la réponse d'erreur :", parseError);
        }
        throw new Error(errorMessage);
      }

      const createdClient = await response.json();
      console.log('✅ Client créé :', createdClient);

      resetForm();
      onAddSuccess();
      onClose();
    } catch (error: any) {
      console.error('🚨 Erreur ajout client :', error);
      Alert.alert('Erreur', error.message || "Impossible d'ajouter le client");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#2c2c2c' : '#ffffff' }]}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Ajouter un client</ThemedText>
            <TouchableOpacity onPress={handleClose}>
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

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAdd}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <ThemedText style={styles.buttonText}>Ajouter</ThemedText>
            )}
          </TouchableOpacity>
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
  addButton: {
    backgroundColor: '#6200ee',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
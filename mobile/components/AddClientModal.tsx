// components/AddClientModal.tsx
import { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ThemedText } from './themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Client = {
  id: number;
  name: string;
  email: string;
  total: number;
};

type AddClientModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (client: Omit<Client, 'id'>) => void;
  nextId: number;
};

export default function AddClientModal({ visible, onClose, onAdd, nextId }: AddClientModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [total, setTotal] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setTotal('');
  };

  const handleAdd = () => {
    if (!name.trim() || !email.trim() || !total.trim()) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
    const amount = parseFloat(total);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Montant invalide.');
      return;
    }

    onAdd({
      name: name.trim(),
      email: email.trim(),
      total: amount,
    });
    resetForm();
    onClose();
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
            placeholder="Nom complet"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: '#ccc' }]}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: '#ccc' }]}
            placeholder="Solde (€)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={total}
            onChangeText={setTotal}
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <ThemedText style={styles.buttonText}>Ajouter</ThemedText>
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
    width: '80%',
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
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
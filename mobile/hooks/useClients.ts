import { useState, useEffect } from 'react';

// Données initiales
let clients = [
  { id: 1, numCompte: 'FR761234567890', nom: 'Dupont Jean', solde: 2500 },
  { id: 2, numCompte: 'FR762345678901', nom: 'Martin Sophie', solde: 800 },
  { id: 3, numCompte: 'FR763456789012', nom: 'Bernard Pierre', solde: 6200 },
  { id: 4, numCompte: 'FR764567890123', nom: 'Petit Marie', solde: 1200 },
];

let nextId = 5;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useClients = () => {
  const [data, setData] = useState(clients);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, min: 0, max: 0 });

  const updateStats = (list: typeof clients) => {
    const total = list.reduce((sum, c) => sum + c.solde, 0);
    const min = list.length ? Math.min(...list.map(c => c.solde)) : 0;
    const max = list.length ? Math.max(...list.map(c => c.solde)) : 0;
    setStats({ total, min, max });
  };

  const loadData = async () => {
    setLoading(true);
    await delay(500);
    setData([...clients]);
    updateStats(clients);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addClient = async (client: { numCompte: string; nom: string; solde: number }) => {
    setLoading(true);
    await delay(500);
    const newClient = { id: nextId++, ...client };
    clients.push(newClient);
    setData([...clients]);
    updateStats(clients);
    setLoading(false);
  };

  const editClient = async (id: number, updated: Partial<typeof clients[0]>) => {
    setLoading(true);
    await delay(500);
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updated };
      setData([...clients]);
      updateStats(clients);
    }
    setLoading(false);
  };

  const deleteClient = async (id: number) => {
    setLoading(true);
    await delay(500);
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
      clients.splice(index, 1);
      setData([...clients]);
      updateStats(clients);
    }
    setLoading(false);
  };

  return { clients: data, stats, loading, loadData, addClient, editClient, deleteClient };
};
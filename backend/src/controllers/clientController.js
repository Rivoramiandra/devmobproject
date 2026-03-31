const clientModel = require('../models/clientModel');

// Créer un client
const createClient = async (req, res) => {
  try {
    const { numCompte, nom, solde } = req.body;
    if (!numCompte || !nom || solde === undefined) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    const newClient = await clientModel.createClient(numCompte, nom, solde);
    res.status(201).json(newClient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer tous les clients
const getAllClients = async (req, res) => {
  try {
    const clients = await clientModel.getAllClients();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer un client par ID
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientModel.getClientById(id);
    if (!client) return res.status(404).json({ error: 'Client non trouvé' });
    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour un client
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { numCompte, nom, solde } = req.body;
    const updated = await clientModel.updateClient(id, numCompte, nom, solde);
    if (!updated) return res.status(404).json({ error: 'Client non trouvé' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un client
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await clientModel.deleteClient(id);
    if (!deleted) return res.status(404).json({ error: 'Client non trouvé' });
    res.json({ message: 'Client supprimé', client: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};
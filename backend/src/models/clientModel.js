const pool = require('../config/db');

// Créer un client
const createClient = async (numCompte, nom, solde) => {
  const query = 'INSERT INTO client (num_compte, nom, solde) VALUES ($1, $2, $3) RETURNING *';
  const values = [numCompte, nom, solde];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Récupérer tous les clients
const getAllClients = async () => {
  const result = await pool.query('SELECT * FROM client ORDER BY id DESC');
  return result.rows;
};

// Récupérer un client par ID
const getClientById = async (id) => {
  const result = await pool.query('SELECT * FROM client WHERE id = $1', [id]);
  return result.rows[0];
};

// Mettre à jour un client
const updateClient = async (id, numCompte, nom, solde) => {
  const query = 'UPDATE client SET num_compte = $1, nom = $2, solde = $3 WHERE id = $4 RETURNING *';
  const values = [numCompte, nom, solde, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Supprimer un client
const deleteClient = async (id) => {
  const result = await pool.query('DELETE FROM client WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};
require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 8000;

// Écoute sur toutes les interfaces réseau (0.0.0.0) pour permettre les connexions externes
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
  console.log(`Accessible depuis l'émulateur Android via http://10.0.2.2:${PORT}`);
});
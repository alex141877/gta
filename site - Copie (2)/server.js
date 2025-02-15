const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Défini le port manuellement si non défini par l'environnement
const PORT = 3000;

// URL de connexion MongoDB
const mongoURI = "mongodb+srv://lecacadu67dansunlit:987654123132121354546@cluster7v2.lwj9j.mongodb.net/serveurtest9";

// Affiche l'URL pour le debug (ATTENTION : À enlever en production)
console.log(`🔗 Tentative de connexion à : ${mongoURI}`);

// Connexion à MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('🌍 Connecté à MongoDB'))
  .catch(err => {
    console.error('❌ Échec de la connexion MongoDB :', err.message);
    process.exit(1);
  });

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// Modèle Mongoose
const userDataSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true }
});

const UserData = mongoose.model('UserData', userDataSchema, 'utilisateurs'); // Nom de la collection forcé à 'utilisateurs'

// Test de connexion MongoDB
app.get('/test-db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send('✅ Connexion à MongoDB réussie !');
  } catch (error) {
    res.status(500).send('❌ Connexion MongoDB échouée : ' + error);
  }
});

// Soumission formulaire
app.post('/submit', async (req, res) => {
  try {
    if (!req.body || !req.body.name || !req.body.password) {
      return res.status(400).json({ error: 'Données invalides' });
    }

    const newUser = new UserData(req.body);
    await newUser.save();
    
    console.log('✅ Données sauvegardées dans MongoDB :', newUser);
    res.status(200).json({ message: 'Formulaire soumis avec succès' });
  } catch (err) {
    console.error('❌ Erreur de sauvegarde', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrage serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur en ligne sur http://0.0.0.0:${PORT}`);
});

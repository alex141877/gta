const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const mongoURI = 'mongodb+srv://desjardinsalex67:YSYS4ZZdhrHSviEb@cluster0.y33wb.mongodb.net/serveur2?retryWrites=true&w=majority';

// Connexion à MongoDB
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
  .then(() => console.log('🌍 Connecté à MongoDB'))
  .catch(err => {
    console.error('❌ Échec de la connexion MongoDB :', err.message);
    process.exit(1); // Arrête le serveur si MongoDB ne répond pas
  });

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); // Ajouter le middleware CORS
app.use(express.static('public'));

// Modèle Mongoose
const userDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }
});

const UserData = mongoose.model('UserData', userDataSchema, 'utilisateurs'); // Nom forcé à 'utilisateurs'

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
    const newUser = new UserData(req.body);
    await newUser.save();
    console.log('✅ Données sauvegardées dans MongoDB');
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

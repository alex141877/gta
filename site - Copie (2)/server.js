require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

// Connexion à MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
  .then(() => console.log('🌍 Connecté à MongoDB'))
  .catch(err => {
    console.error('❌ Échec de la connexion MongoDB :', err);
    process.exit(1);
  });

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// Modèle Mongoose
const userDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }
});

const UserData = mongoose.model('UserData', userDataSchema);

// Vérification serveur
app.get('/', (req, res) => {
  res.send('✅ Serveur opérationnel !');
});

// Vérification connexion MongoDB
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
    console.log('📩 Données reçues :', req.body);
    
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
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur http://0.0.0.0:${PORT}`);
});

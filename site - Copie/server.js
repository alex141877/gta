const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Ajout de CORS
const app = express();

const PORT = process.env.PORT || 3000;  // Utilisation du port fourni par Railway
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://desjardinsalex67:YSYS4ZZdhrHSviEb@cluster0.y33wb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connexion à MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,  // Timeout pour éviter le blocage
  socketTimeoutMS: 45000
})
  .then(() => console.log('🌍 Connecté à MongoDB'))
  .catch(err => {
    console.error('❌ Échec de la connexion MongoDB :', err);
    process.exit(1); // Arrête le serveur si MongoDB ne répond pas
  });

// Middleware pour parser les données
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Utilisation de CORS pour autoriser les requêtes de tous les domaines
app.use(cors({
  origin: '*',  // Permet les requêtes depuis n'importe quel domaine
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Dossier public pour fichiers statiques
app.use(express.static('public'));

// Définition du modèle MongoDB
const userDataSchema = new mongoose.Schema({
  name: { type: String, required: true },   // ici "name" pourrait être l'email
  password: { type: String, required: true }  // Remplace "message" par "password"
});

const UserData = mongoose.model('UserData', userDataSchema);

// Endpoint pour tester la connexion à MongoDB
app.get('/test-db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.send('✅ Connexion à MongoDB réussie !');
  } catch (error) {
    res.status(500).send('❌ Connexion MongoDB échouée : ' + error);
  }
});

// Endpoint pour gérer la soumission du formulaire
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

// Permet les requêtes de pré-évaluation (preflight) CORS
app.options('*', cors()); // Permet les pré-requêtes (OPTIONS)

// Démarrage du serveur sur Railway
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur en ligne sur http://0.0.0.0:${PORT}`);
});

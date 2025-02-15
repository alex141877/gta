const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Servir les fichiers statiques à partir du dossier public
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à MongoDB Atlas
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion réussie à MongoDB Atlas'))
    .catch(err => console.log('Erreur de connexion à MongoDB Atlas: ', err));

// Créer un modèle pour les utilisateurs
const User = mongoose.model('User', new mongoose.Schema({
    email: String,
    password: String
}));

// Route pour traiter la connexion
app.post('/connexion', (req, res) => {
    const { email, password } = req.body;
    const newUser = new User({ email, password });

    newUser.save()
        .then(() => res.send('Données enregistrées avec succès!'))
        .catch(err => res.status(400).send('Erreur lors de l\'enregistrement des données.'));
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors({
    origin: ['http://tp2-campagnes-pub-thiry.s3-website.eu-north-1.amazonaws.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(helmet());
app.use(express.json());

// Données en mémoire pour simuler une base de données
const campaignsData = [
  {
    _id: "1",
    name: "Campagne de lancement produit",
    status: "active",
    budget: 5000,
    startDate: "2025-05-01",
    endDate: "2025-05-30"
  },
  {
    _id: "2",
    name: "Promotion été",
    status: "paused",
    budget: 3000,
    startDate: "2025-06-01",
    endDate: "2025-08-31"
  },
  {
    _id: "3",
    name: "Black Friday",
    status: "planned",
    budget: 10000,
    startDate: "2025-11-20",
    endDate: "2025-11-30"
  }
];

// Routes
app.get('/api/campaigns', (req, res) => {
  res.json(campaignsData);
});

app.get('/api/campaigns/:id', (req, res) => {
  const campaign = campaignsData.find(camp => camp._id === req.params.id);
  if (!campaign) {
    return res.status(404).json({ message: "Campagne non trouvée" });
  }
  res.json(campaign);
});

app.post('/api/campaigns', (req, res) => {
  const newCampaign = {
    _id: Date.now().toString(),
    ...req.body
  };
  campaignsData.push(newCampaign);
  res.status(201).json(newCampaign);
});

// Route de santé pour les vérifications
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Le serveur fonctionne correctement!' });
});

// Route racine
app.get('/', (req, res) => {
  res.send('API de gestion de campagnes publicitaires - TP2 DevOps & Cloud');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Port d'écoute (important pour Elastic Beanstalk)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});
# Vérifier si Node.js est installé
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js n'est pas installé. Veuillez l'installer et réessayer."
    Read-Host "Appuyez sur Entrée pour quitter"
    exit
}

# Vérifier si npm est installé
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "npm n'est pas installé. Veuillez l'installer et réessayer."
    Read-Host "Appuyez sur Entrée pour quitter"
    exit
}

# Vérifier si curl est installé
if (-not (Get-Command curl -ErrorAction SilentlyContinue)) {
    Write-Host "curl n'est pas installé, installation de curl..."
    # Ajouter ici le script d'installation de curl si nécessaire
}

# Définir le chemin du dossier "site" sur le Bureau
$SITE_DIR = "$env:USERPROFILE\Desktop\laucher-site\site"

# Vérifier si le dossier "site" existe
if (-not (Test-Path $SITE_DIR)) {
    Write-Host "Le dossier $SITE_DIR n'existe pas. Assurez-vous que le dossier 'site' est présent sur votre Bureau."
    Read-Host "Appuyez sur Entrée pour quitter"
    exit
}

# Aller dans le dossier "site"
Set-Location $SITE_DIR

# Initialiser un projet Node.js avec npm (si pas déjà fait)
if (-not (Test-Path "package.json")) {
    Write-Host "Initialisation du projet Node.js..."
    npm init -y
}

# Installer les dépendances nécessaires
Write-Host "Installation des dépendances express et body-parser..."
npm install express body-parser

# Créer le dossier public pour les fichiers statiques (si nécessaire)
if (-not (Test-Path "public")) {
    New-Item -ItemType Directory -Path "public" | Out-Null
}

# Copier les fichiers index.html et style.css dans le dossier public (si ce n'est pas déjà fait)
Copy-Item -Force "index.html" "public\index.html"
Copy-Item -Force "style.css" "public\style.css"

# Créer le fichier data.json vide (si ce n'est pas déjà fait)
if (-not (Test-Path "data.json")) {
    "[]" | Out-File "data.json" -Encoding utf8
}

# Lancer le serveur
Write-Host "Démarrage du serveur..."
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"

# Ajouter une pause à la fin pour ne pas fermer la fenêtre automatiquement
Read-Host "Appuyez sur Entrée pour quitter"
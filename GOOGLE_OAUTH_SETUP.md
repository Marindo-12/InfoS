# Configuration Authentification Google OAuth 2.0

## 📋 Étapes pour obtenir les clés Google

### 1. Aller à Google Cloud Console
- Accédez à: https://console.cloud.google.com/
- Connectez-vous avec votre compte Google

### 2. Créer un nouveau projet
- Cliquez sur le sélecteur de projet (en haut à gauche)
- Cliquez sur "Nouveau projet"
- Donnez un nom: "Info Saloua" ou "Info Saloua Dev"
- Cliquez sur "Créer"
- Attendez que le projet se crée (1-2 minutes)

### 3. Activer l'API Google+
- Dans le menu de gauche, allez à "APIs et services" > "Bibliothèque"
- Recherchez "Google+ API" ou "Google Identity"
- Cliquez sur "Google+ API"
- Cliquez sur le bouton "Activer"

### 4. Créer les identifiants OAuth
- Allez à "APIs et services" > "Identifiants"
- Cliquez sur "Créer des identifiants"
- Sélectionnez "ID client OAuth 2.0"

### 5. Configurer l'écran de consentement
Si c'est la première fois:
- Cliquez sur "Écran de consentement"
- Sélectionnez "Externe" (type d'utilisateur)
- Cliquez sur "Créer"
- Remplissez les informations:
  - **Nom de l'application**: Info Saloua
  - **Email de support utilisateur**: votre-email@example.com
  - **Email de contact du développeur**: votre-email@example.com
- Cliquez sur "Enregistrer et continuer"
- Dans "Scopes", continuez sans ajouter (les scopes par défaut suffisent)
- Cliquez sur "Enregistrer et continuer"

### 6. Créer l'ID client OAuth
- Retour à "Identifiants"
- Cliquez sur "Créer des identifiants"
- Sélectionnez "ID client OAuth 2.0"
- Type d'application: "Application web"
- Donnez un nom: "Info Saloua Web App"

### 7. Ajouter les URL autorisées

**Pour le développement local:**
- **URIs de redirection autorisés**:
  - http://localhost:8000
  - http://localhost:8000/auth/google/callback
  - http://127.0.0.1:8000
  - http://127.0.0.1:8000/auth/google/callback

**Pour Railway (production):**
- Remplacez `localhost:8000` par votre domaine Railway
- Exemple: https://infosaloua.railway.app
- https://infosaloua.railway.app/auth/google/callback

### 8. Copier les clés
- **ID client**: Copiez et conservez
- **Secret client**: Copiez et conservez (⚠️ NE JAMAIS partager publiquement)

---

## 🛠 Installation et Configuration Locale

### 1. Installer Laravel Socialite
```bash
composer require laravel/socialite
```

### 2. Mettre à jour le fichier .env
```env
# Ajouter ces lignes à votre fichier .env local
GOOGLE_CLIENT_ID=votre_id_client_ici
GOOGLE_CLIENT_SECRET=votre_secret_client_ici
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback
```

### 3. Exécuter la migration
```bash
php artisan migrate
```

### 4. Tester localement
```bash
php artisan serve
```

- Allez à http://localhost:8000/login
- Cliquez sur "Continuer avec Google"
- Vous devriez être redirigé vers Google
- Après authentification, vous serez logged in

---

## 🚀 Configuration pour Railway

### 1. Ajouter les variables d'environnement à Railway

Sur le dashboard Railway:
1. Allez à votre projet
2. Cliquez sur l'onglet "Variables"
3. Ajoutez les variables:

```
GOOGLE_CLIENT_ID = votre_id_client_ici
GOOGLE_CLIENT_SECRET = votre_secret_client_ici
GOOGLE_CALLBACK_URL = https://votre-domaine-railway.app/auth/google/callback
```

**Pour trouver votre URL Railway:**
- Dans Railway, cliquez sur votre service
- L'URL est affichée en haut (ex: infosaloua.railway.app)
- Utilisez format: https://votre-domaine.railway.app

### 2. Mettre à jour les URIs autorisés Google
- Retour à Google Cloud Console > Identifiants
- Éditez votre ID client
- Ajoutez dans "URIs de redirection autorisés":
  - https://votre-domaine-railway.app
  - https://votre-domaine-railway.app/auth/google/callback

### 3. Redéployer sur Railway
```bash
git add .
git commit -m "Add Google OAuth authentication"
git push
```

Railway redéploiera automatiquement.

---

## 🔒 Variables de configuration Railway (.env pour production)

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine-railway.app

# Database (Railway setup)
DB_CONNECTION=mysql
DB_HOST=votre-host-railway
DB_PORT=3306
DB_DATABASE=votre_database
DB_USERNAME=root
DB_PASSWORD=votre_password

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120

# Google OAuth
GOOGLE_CLIENT_ID=votre_id_client_ici
GOOGLE_CLIENT_SECRET=votre_secret_client_ici
GOOGLE_CALLBACK_URL=https://votre-domaine-railway.app/auth/google/callback

# Mail (pour emails de confirmation)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_mailtrap_username
MAIL_PASSWORD=votre_mailtrap_password
MAIL_FROM_ADDRESS=noreply@infosaloua.app

# Cache
CACHE_STORE=redis
REDIS_HOST=votre-redis-railway-host
REDIS_PASSWORD=votre_password
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis
```

---

## 🧪 Tests de l'authentification

### Test local:
1. `php artisan serve`
2. Allez à http://localhost:8000/login
3. Cliquez sur "Continuer avec Google"
4. Vérifiez que vous êtes logué et redirigé au dashboard

### Test sur Railway:
1. Allez à https://votre-domaine-railway.app/login
2. Même processus que local
3. Vérifiez que l'utilisateur est créé dans la base de données

---

## 🐛 Dépannage

### Erreur "Redirect URI mismatch"
- Vérifiez que l'URL de callback dans .env correspond exactement à celle dans Google Cloud Console
- Vérifiez qu'il n'y a pas de slash final manquant ou en trop

### Erreur "The provided authorization code is invalid"
- Les codes OAuth expirent rapidement (quelques minutes)
- Réessayez de vous connecter
- Vérifiez que le serveur PHP a accès à Internet

### L'utilisateur n'est pas créé
- Vérifiez que la migration `add_google_id_to_users_table` a été exécutée
- Vérifiez les logs: `storage/logs/laravel.log`

### Problème avec les sessions sur Railway
- Assurez-vous que `SESSION_DRIVER=database` ou `redis`
- Vérifiez que la table `sessions` existe
- Exécutez `php artisan migrate` sur Railway si nécessaire

---

## 📚 Fichiers modifiés

✅ `app/Http/Controllers/Auth/GoogleAuthController.php` - Contrôleur OAuth
✅ `app/Models/User.php` - Ajout du champ `google_id`
✅ `database/migrations/2026_05_06_000000_add_google_id_to_users_table.php` - Migration
✅ `config/services.php` - Configuration des services Google
✅ `routes/auth.php` - Routes OAuth
✅ `resources/js/Pages/Auth/Login.tsx` - Bouton Google corrigé
✅ `.env.example` - Variables d'environnement

---

## 🎯 Résumé des variables d'environnement

**Développement local (.env):**
```
GOOGLE_CLIENT_ID=votre_id_client
GOOGLE_CLIENT_SECRET=votre_secret_client
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback
```

**Production Railway (Variables Railway):**
```
GOOGLE_CLIENT_ID=votre_id_client
GOOGLE_CLIENT_SECRET=votre_secret_client
GOOGLE_CALLBACK_URL=https://votre-domaine-railway.app/auth/google/callback
```

**Note:** Les secrets ne doivent JAMAIS être committes dans git. Utilisez toujours les variables d'environnement.

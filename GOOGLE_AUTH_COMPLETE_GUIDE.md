# 🚀 Guide Complet - Authentification Google OAuth pour Info Saloua

## ✅ Étape 1: Obtenir les clés Google (5-10 minutes)

### 1.1 Accéder à Google Cloud Console
1. Ouvrez: https://console.cloud.google.com/
2. Connectez-vous avec un compte Gmail (créez-en un si nécessaire)
3. Acceptez les conditions d'utilisation

### 1.2 Créer un nouveau projet
1. En haut à gauche, cliquez sur "Select a project" ou le sélecteur de projet
2. Cliquez sur "NEW PROJECT"
3. Nom du projet: **Info Saloua** (ou Info Saloua Dev)
4. Cliquez sur "CREATE"
5. Attendez 1-2 minutes que le projet se crée
6. Une fois créé, sélectionnez-le depuis le menu déroulant

### 1.3 Activer les APIs Google+
1. Dans le menu gauche, allez à: **APIs & Services > Library**
2. Recherchez: `Google+ API`
3. Cliquez sur le résultat
4. Cliquez sur le bouton bleu "ENABLE"
5. Attendez quelques secondes

### 1.4 Configurer l'écran de consentement OAuth
1. Menu gauche: **APIs & Services > OAuth consent screen**
2. Sélectionnez **External** (type d'utilisateur)
3. Cliquez sur **CREATE**
4. Remplissez le formulaire:
   - **App name**: Info Saloua
   - **User support email**: utilisez votre email Gmail
   - **Developer contact**: votre email
5. Cliquez sur **SAVE AND CONTINUE**
6. Scopes: Cliquez directement sur **SAVE AND CONTINUE** (les scopes par défaut suffisent)
7. Test users: **SAVE AND CONTINUE** (optionnel)
8. Review: Cliquez sur **BACK TO DASHBOARD**

### 1.5 Créer les identifiants OAuth
1. Menu gauche: **APIs & Services > Credentials**
2. Cliquez sur **+ CREATE CREDENTIALS**
3. Sélectionnez: **OAuth client ID**
4. Type d'application: **Web application**
5. Nom: **Info Saloua Web App**
6. Sous "Authorized redirect URIs", ajoutez:
   ```
   http://localhost:8000
   http://localhost:8000/auth/google/callback
   http://127.0.0.1:8000
   http://127.0.0.1:8000/auth/google/callback
   ```
7. Cliquez sur **CREATE**

### 1.6 ✅ Copier les clés
Une fenêtre s'affichera avec:
- **Client ID**: Copiez cette longue chaîne
- **Client Secret**: Copiez cette chaîne

**Sauvegardez ces clés de manière sécurisée** (dans un fichier texte temporaire, ou une note)

**⚠️ IMPORTANT:** Ne partagez JAMAIS votre `Client Secret` publiquement!

---

## ✅ Étape 2: Configuration Locale (15 minutes)

### 2.1 Mettre à jour le fichier .env
1. Ouvrez le fichier `.env` à la racine du projet
2. Trouvez les lignes Google (vers la fin):
   ```
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback
   ```
3. Collez vos clés:
   ```
   GOOGLE_CLIENT_ID=votre_id_client_copie_ici
   GOOGLE_CLIENT_SECRET=votre_secret_client_copie_ici
   GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback
   ```

### 2.2 Démarrer les services Docker
```bash
# Dans un terminal
docker-compose up -d

# Vérifiez que PostgreSQL est actif
docker ps
```

### 2.3 Exécuter les migrations
```bash
php artisan migrate
```

### 2.4 Tester localement
```bash
# Terminal 1: Démarrer le serveur Laravel
php artisan serve

# Terminal 2: Dans un autre terminal, démarrer Vite
npm run dev
```

### 2.5 Tester l'authentification
1. Ouvrez http://localhost:8000
2. Allez sur http://localhost:8000/login
3. Cliquez sur le bouton **"Continuer avec Google"**
4. Vous devez être redirigé vers Google
5. Connectez-vous avec votre compte Google
6. Vous devez être redirigé et logué dans l'application ✅

---

## ✅ Étape 3: Configuration Railway (Production)

### 3.1 Obtenir votre URL de domaine Railway
1. Allez sur https://railway.app/ et connectez-vous
2. Sélectionnez votre projet **Info Saloua**
3. Cliquez sur le service **web** (ou votre service app)
4. Trouvez l'URL dans l'onglet **Settings > Domains**
5. Elle ressemble à: `https://infosaloua-production.up.railway.app/` ou un domaine custom

**Notez cette URL, vous en aurez besoin**

### 3.2 Ajouter les clés à Google Cloud Console
1. Retour à https://console.cloud.google.com/
2. Allez à: **APIs & Services > Credentials**
3. Trouvez votre **Client ID** créé plus tôt
4. Cliquez sur le crayon (edit)
5. Sous "Authorized redirect URIs", ajoutez:
   ```
   https://votre-domaine-railway.app
   https://votre-domaine-railway.app/auth/google/callback
   ```
   (Remplacez `votre-domaine-railway.app` par votre URL réelle)
6. Cliquez sur **SAVE**

### 3.3 Ajouter les variables à Railway
1. Sur Railway, allez à votre projet
2. Cliquez sur l'onglet **Variables**
3. Cliquez sur **Add Variable** et entrez:

```
GOOGLE_CLIENT_ID = votre_id_client_ici
GOOGLE_CLIENT_SECRET = votre_secret_client_ici
GOOGLE_CALLBACK_URL = https://votre-domaine-railway.app/auth/google/callback
```

(Les clés sont les mêmes que pour le développement local)

### 3.4 Exécuter les migrations sur Railway
```bash
# Option 1: Via Railway CLI
railway run php artisan migrate

# Option 2: Via le dashboard Railway
# Cliquez sur "Deployments" > sélectionnez le dernier déploiement
# Cliquez sur "View Logs" pour voir les migrations
```

### 3.5 Redéployer l'application
```bash
git add .
git commit -m "Add Google OAuth authentication"
git push  # ou git push origin main
```

Railway détectera les changements et redéploiera automatiquement.

### 3.6 Tester sur Railway
1. Allez à votre URL Railway: `https://votre-domaine-railway.app/login`
2. Cliquez sur **"Continuer avec Google"**
3. L'authentification devrait fonctionner ✅

---

## 📊 Architecte de l'authentification

```
┌─────────────┐
│   Utilisateur  │
└──────┬──────┘
       │ Clique sur "Continuer avec Google"
       ▼
┌──────────────────────────────┐
│  Login Page (React)           │
│  Button → route('auth.google')│
└──────────────────┬────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  GoogleAuthController │
        │  →redirect() method   │
        └──────────────────┬───┘
                           │ Redirect to Google
                           ▼
                   ┌──────────────┐
                   │ Google OAuth │
                   │   Server     │
                   └──────────────┘
                           │ User authorizes
                           ▼
        ┌──────────────────────────────┐
        │ GoogleAuthController          │
        │ →callback() method            │
        │ - Get user from Google        │
        │ - Create/Update in DB         │
        │ - Login user                  │
        └──────────────────┬────────────┘
                           │
                           ▼
                    ┌────────────────┐
                    │  Dashboard      │
                    │  (Logged in ✅)  │
                    └────────────────┘
```

---

## 🔐 Fichiers Modifiés

### Contrôleurs
- ✅ `app/Http/Controllers/Auth/GoogleAuthController.php` (NOUVEAU)
  - Gère la redirection OAuth
  - Gère le callback de Google
  - Crée/met à jour l'utilisateur

### Models
- ✅ `app/Models/User.php`
  - Ajout du champ `google_id` au fillable

### Routes
- ✅ `routes/auth.php`
  - Route GET `auth/google` → redirect
  - Route GET `auth/google/callback` → callback

### Configuration
- ✅ `config/services.php`
  - Configuration Google OAuth

### UI
- ✅ `resources/js/Pages/Auth/Login.tsx`
  - Bouton Google corrigé (pointait vers `route('about')`, maintenant `route('auth.google')`)

### Database
- ✅ `database/migrations/2026_05_06_000000_add_google_id_to_users_table.php` (NOUVEAU)
  - Ajoute la colonne `google_id` à la table `users`

### Environment
- ✅ `.env` (LOCAL)
  - Ajout des variables Google OAuth
- ✅ `.env.example`
  - Ajout des variables Google OAuth (pour documentation)

---

## 🧪 Checklist de Vérification

### Développement Local
- [ ] Composer require laravel/socialite installé ✅
- [ ] Migration exécutée: `php artisan migrate` ✅
- [ ] Fichier .env mis à jour avec GOOGLE_CLIENT_ID ✅
- [ ] Fichier .env mis à jour avec GOOGLE_CLIENT_SECRET ✅
- [ ] Serveur Laravel en cours d'exécution: `php artisan serve` ✅
- [ ] Vite dev server en cours d'exécution: `npm run dev` ✅
- [ ] Page de login accessible: http://localhost:8000/login ✅
- [ ] Clic sur "Continuer avec Google" redirige vers Google ✅
- [ ] Après authentification, l'utilisateur est logué ✅

### Production (Railway)
- [ ] Variables Google ajoutées dans Railway ✅
- [ ] URIs de redirection ajoutées à Google Cloud Console ✅
- [ ] Application redéployée après les changements ✅
- [ ] Migration exécutée sur Railway ✅
- [ ] Domaine configuré sur Railway ✅
- [ ] HTTPS activé sur Railway (défaut) ✅
- [ ] Authentification fonctionne sur Railway ✅

---

## 🐛 Dépannage

### "Invalid Client ID" ou "Client mismatch"
**Cause**: Les IDs ne correspondent pas
**Solution**:
1. Vérifiez que vous copiez exactement le bon Client ID
2. Vérifiez qu'il n'y a pas d'espaces superflus

### "Redirect URI mismatch"
**Cause**: L'URL de callback ne correspond pas
**Solution**:
1. Vérifiez que `GOOGLE_CALLBACK_URL` dans .env est exact
2. Vérifiez que cette URL est ajoutée dans Google Cloud Console
3. Vérifiez l'orthographe (http vs https, slash à la fin, etc.)

### "The authorization code is invalid"
**Cause**: Le code OAuth a expiré (durée de vie: quelques minutes)
**Solution**:
1. Réessayez de vous connecter
2. Vérifiez que le serveur Laravel n'a pas d'erreurs

### "Could not translate host name 'postgres'"
**Cause**: La base de données n'est pas en cours d'exécution
**Solution**:
```bash
docker-compose up -d  # Démarrer Docker
php artisan migrate    # Exécuter les migrations
```

### L'utilisateur n'apparaît pas dans la BD
**Cause**: La migration n'a pas été exécutée
**Solution**:
```bash
php artisan migrate --step 1  # Exécuter les migrations
```

### La session n'est pas sauvegardée
**Cause**: `SESSION_DRIVER` incorrectement configuré
**Solution**: Vérifiez que `.env` contient:
```
SESSION_DRIVER=database
```

---

## 📚 Ressources Utiles

- [Laravel Socialite Documentation](https://laravel.com/docs/socialite)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Railway Documentation](https://docs.railway.app/)
- [Laravel Authentication](https://laravel.com/docs/authentication)

---

## 💾 Fichiers Importants

```
infos/
├── app/Http/Controllers/Auth/
│   └── GoogleAuthController.php          ← Contrôleur OAuth (NOUVEAU)
├── app/Models/
│   └── User.php                          ← Ajout google_id (MODIFIÉ)
├── database/migrations/
│   └── 2026_05_06_000000_*.php          ← Migration google_id (NOUVEAU)
├── routes/
│   └── auth.php                          ← Routes OAuth (MODIFIÉ)
├── config/
│   └── services.php                      ← Config Google (MODIFIÉ)
├── resources/js/Pages/Auth/
│   └── Login.tsx                         ← Bouton Google (MODIFIÉ)
├── .env                                  ← Variables locales (MODIFIÉ)
├── .env.example                          ← Template .env (MODIFIÉ)
└── GOOGLE_OAUTH_SETUP.md                 ← Ce fichier
```

---

## 🎯 Résumé Rapide

**Pour le développement local:**
1. Obtenez les clés Google (https://console.cloud.google.com/)
2. Mettez à jour `.env` avec vos clés
3. Exécutez `php artisan migrate`
4. Testez sur http://localhost:8000/login

**Pour Railway (production):**
1. Ajoutez les variables à Railway
2. Ajoutez les URIs à Google Cloud Console
3. Git push pour redéployer
4. Testez sur votre URL Railway

**Variables d'environnement essentielles:**
```env
# Local
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback

# Railway (même ID/Secret)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://votre-domaine-railway.app/auth/google/callback
```

---

**✅ Authentification Google OAuth configurée et prête à l'emploi!**

# Publier le site Café Socco sur GitHub (lien pour le client)

## Étape 1 — Créer un compte et un dépôt

1. Allez sur [github.com](https://github.com) et créez un compte (gratuit).
2. Cliquez sur **+** → **New repository**.
3. Nom du dépôt : `cafe-socco` (ou autre nom, sans espaces).
4. Laissez **Public**.
5. Ne cochez pas « Add README ».
6. Cliquez **Create repository**.

## Étape 2 — Installer Git (si besoin)

Téléchargez Git : [git-scm.com/download/win](https://git-scm.com/download/win)  
Installez-le, puis redémarrez l’ordinateur.

## Étape 3 — Envoyer les fichiers du site

Ouvrez **PowerShell** ou **Invite de commandes**, puis copiez-collez (une ligne à la fois) :

```powershell
cd "c:\Users\hp\Desktop\projet jihane"
git init
git add index.html css js README.md
git commit -m "Site Café Socco"
git branch -M main
git remote add origin https://github.com/VOTRE_NOM_UTILISATEUR/cafe-socco.git
git push -u origin main
```

Remplacez `VOTRE_NOM_UTILISATEUR` par votre identifiant GitHub.  
À la première connexion, GitHub demandera identifiant + mot de passe (ou token).

## Étape 4 — Activer GitHub Pages (le lien public)

1. Sur GitHub, ouvrez votre dépôt `cafe-socco`.
2. **Settings** → menu gauche **Pages**.
3. **Branch** : choisissez `main` et dossier **`/ (root)`**.
4. Cliquez **Save**.
5. Attendez 1 à 3 minutes.

Votre lien sera :

```
https://VOTRE_NOM_UTILISATEUR.github.io/cafe-socco/
```

Exemple : `https://jihane.github.io/cafe-socco/`

Envoyez ce lien à votre client — il fonctionne sur téléphone et ordinateur.

## Mettre à jour le site plus tard

Après chaque modification :

```powershell
cd "c:\Users\hp\Desktop\projet jihane"
git add .
git commit -m "Mise à jour du site"
git push
```

Le lien reste le même ; le site se met à jour en quelques minutes.

## Option sans Git (glisser-déposer)

1. Sur la page du dépôt GitHub, **Add file** → **Upload files**.
2. Glissez tout le dossier du site (`index.html`, `css`, `js`, etc.).
3. **Commit changes**.
4. Activez **Pages** comme à l’étape 4.

## Email automatique (Web3Forms)

Sur le site en ligne, pour les réservations par email sans WhatsApp :

1. [web3forms.com](https://web3forms.com) → clé gratuite avec `Jihanemj111@gmail.com`
2. Collez la clé dans `js/config.js` → `web3formsKey`
3. Refaites `git add`, `commit`, `push`

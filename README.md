# Café Socco — Site Web Officiel

Site web moderne et immersif pour le **Café Socco**, café culturel et musical oriental.

## Fonctionnalités

- Design responsive (mobile, tablette, ordinateur)
- Scène 3D interactive (Three.js) : grains de café, tasses, anneaux dorés, vapeur
- Effets 3D CSS sur les cartes (inclinaison au survol)
- 7 sections : Accueil, À propos, Menu, Soirées, Galerie, Réservation, Contact
- Formulaires de réservation et de contact
- Galerie filtrable avec lightbox
- Intégration Google Maps
- Optimisation SEO (meta tags, structure sémantique)
- Charte graphique : marron café, beige, noir, doré oriental

## Lancer le site

**Méthode recommandée (Windows)** — double-cliquez sur :

- `DEMARRER-SITE.bat` → serveur sur http://localhost:8080 (ouvre le navigateur automatiquement)
- `OUVRIR-SITE.bat` → ouvre `index.html` directement (sans serveur)

Si `localhost:8080` affiche « connexion refusée », c’est que le serveur n’est pas lancé : utilisez `DEMARRER-SITE.bat` et laissez la fenêtre noire ouverte.

## Structure

```
projet jihane/
├── index.html      # Page principale (single-page)
├── css/
│   └── style.css   # Styles et animations 3D
├── js/
│   └── main.js     # Three.js + interactions
└── README.md
```

## Personnalisation

- **Images** : Remplacez les URLs Unsplash par vos propres photos
- **Google Maps** : Mettez à jour l’iframe dans la section Contact avec votre adresse réelle
- **Réseaux sociaux** : Modifiez les liens `href="#"` dans la section Contact
- **Coordonnées** : Téléphone, email et adresse dans Contact et Footer

## Technologies

- HTML5, CSS3 (variables, grid, flexbox, 3D transforms)
- JavaScript (vanilla)
- Three.js r128 (CDN)
- Google Fonts : Cormorant Garamond, Montserrat

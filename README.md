# Portfolio Carl Stephen Junior PIERRE-LOUIS

Portfolio statique pret pour GitHub Pages. Le projet utilise uniquement HTML, CSS et JavaScript.

## Structure

- `index.html` : contenu du portfolio
- `styles.css` : interface responsive et animations
- `script.js` : navigation, animations, formulaire de contact
- `assets/profile-placeholder.svg` : image temporaire pour la zone photo

## Hebergement GitHub Pages

1. Pousse le depot sur GitHub.
2. Va dans `Settings > Pages`.
3. Choisis `Deploy from a branch`.
4. Selectionne la branche `main` et le dossier `/root`.

## Formulaire de contact

Le formulaire utilise FormSubmit avec l'adresse configurée dans `script.js`.

Dans `script.js`, remplace:

```js
const CONTACT_EMAIL = "spierrelouis45@gmail.com";
```

Au premier envoi, FormSubmit enverra un email de confirmation a cette adresse.

Si l'adresse n'est pas configurée, le formulaire prépare un email via `mailto:` en solution de secours.

## Photo professionnelle

Remplace `assets/profile-placeholder.jpeg` par ta photo professionnelle ou modifie les deux attributs `src` dans `index.html`.

## Images des projets

Chaque zone visuelle de projet accepte jusqu'a 3 images dans son bloc `.project-slides`.
Le carrousel passe automatiquement d'une image a l'autre quand la section Projets est visible.

Exemple:

```html
<div class="project-slides">
  <img src="assets/projects/projet-1.jpg" alt="Capture du projet">
  <img src="assets/projects/projet-2.jpg" alt="Deuxieme capture du projet">
  <img src="assets/projects/projet-3.jpg" alt="Troisieme capture du projet">
</div>
```

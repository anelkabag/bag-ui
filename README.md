# Bag UI

Mini documentation pour ce projet `bag-ui`.

## Présentation

Ce projet est un site Next.js qui expose un catalogue de blocs et composants issu d’un registre statique `public/r`.

Il est conçu pour fonctionner comme un registre shadcn custom :

- `registry.json` est la source de vérité du registre.
- `public/r/registry.json` est le registre public utilisé par l’application.
- `public/r/*.json` contient les items de registre individuels.
- `components/ComponentPreview.tsx` charge dynamiquement les composants à partir du registre.

## Structure importante

- `app/page.tsx` : page d’accueil
- `components/navbar.tsx` : barre de navigation
- `components/Hero.tsx` : section hero
- `components/Blockscatalog.tsx` : affichage du catalogue de blocs
- `components/ComponentPreview.tsx` : prévisualisation dynamique
- `registry.json` : registre racine
- `public/r/registry.json` : registre public exploité par l’app
- `public/r/*.json` : items de registre

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Puis ouvrir :

```bash
http://localhost:3000
```

## Build et production

```bash
npm run build
npm run start
```

## Registre et génération

Le projet utilise maintenant un registre statique `public/r` :

- pour qu’un nouveau composant soit visible, il faut mettre à jour `registry.json`
- puis lancer `npm run registry:build`
- cela met à jour `public/r/registry.json` et `public/r/<nom>.json`

### Ajouter un composant

1. Ajouter l’item dans `registry.json`
2. Ajouter le composant dans `registry/default/...`
3. Lancer `npm run registry:build`
4. Vérifier `public/r/registry.json` et `public/r/<nom>.json`

## Commandes utiles

```bash
npm run dev
npm run build
npm run start
npm run registry:build
```

## Notes

- Le pipeline de génération `component-map` a été retiré.
- L’application dépend maintenant du contenu statique de `public/r` pour afficher le registre.
- `public/r/team-section.json` est un exemple d’item de registre.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- shadcn registry
- Framer Motion, GSAP

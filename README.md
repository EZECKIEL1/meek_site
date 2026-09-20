# MËËK — Site Vitrine

Site vitrine statique pour **MËËK**, maison de mode luxe (prêt-à-porter, chaussures, maroquinerie, accessoires, joaillerie). Commande via WhatsApp, sans backend.

## Structure du projet

```
meek_site/
├── index.html              → Page d'accueil (collections, produits, à propos, newsletter)
├── contact.html            → Formulaire de contact
├── success.html            → Page affichée après envoi du formulaire
├── css/
│   └── style.css           → Toute la mise en forme du site
├── js/
│   ├── main.js              → Curseur personnalisé, animations au scroll, newsletter
│   └── cart.js               → Panier (localStorage) + commande via WhatsApp
└── assets/
    ├── meek-logo.png         → Logo principal
    ├── meek-watermark.png    → Monogramme MK (fond transparent, utilisé en filigrane)
    └── products/              → Photos produits (une par article)
```

Aucun PHP, aucune base de données : tout tourne côté navigateur.

## Lancer le site en local

Ouvrir `index.html` directement dans un navigateur fonctionne pour un premier aperçu, mais certains navigateurs bloquent les requêtes locales. Pour un test fidèle à la production, lancer un petit serveur local depuis le dossier du projet :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Modifier les produits et les prix

Chaque produit est un bloc `<div class="product-card">` dans `index.html` (section `<!-- PRODUITS -->`). Pour changer un prix, modifier **deux endroits** dans le même bloc :

```html
<button class="product-add" data-add-to-cart data-id="cap-signature" data-name="MËËK Cap Signature" data-price="55000">Ajouter au panier</button>
...
<div class="product-price">55 000 FCFA</div>
```

`data-price` (nombre, sans espace) est ce qui compte réellement dans le panier — le texte affiché juste en dessous est purement visuel et doit être mis à jour en même temps, sinon le prix affiché et le prix facturé ne correspondront plus.

Pour ajouter un nouveau produit, dupliquer un bloc `product-card` existant, changer `data-id` (unique), `data-name`, `data-price`, l'image, la catégorie et le nom affiché.

## Changer le numéro WhatsApp

Dans `js/cart.js`, tout en haut :

```js
const WHATSAPP_NUMBER = "2290190724866";
```

Format : indicatif pays + numéro, sans `+` ni espaces.

## Le formulaire de contact (FormSubmit)

`contact.html` et le formulaire newsletter de `index.html` envoient les messages via [FormSubmit](https://formsubmit.co), un service gratuit sans backend, vers **ezeckielmeek@gmail.com**.

**Important** : lors du tout premier envoi (test ou vrai message client), FormSubmit envoie un email de confirmation à cette adresse. Il faut cliquer sur le lien de confirmation dedans, sinon les messages suivants n'arriveront jamais. À faire une seule fois, dès la mise en ligne.

## Déploiement

Le site est 100 % statique et peut être hébergé gratuitement sur GitHub Pages, Netlify ou Vercel — aucune configuration de build nécessaire (pas de framework, pas de `npm install`).

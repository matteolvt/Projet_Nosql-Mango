# 🍽️ DeliveCROUS

Application web full-stack inspirée d’Uber Eats, conçue pour simplifier la **livraison de repas aux étudiants**.  
Le projet a été réalisé dans le cadre du module de **Base de Données / Développement Web**.

---

## 🚀 Stack technique

- **Front-end :** React (Vite) — hébergé sur [Vercel](https://projet-nosql-mango.vercel.app)
- **Back-end :** Node.js + Express — hébergé sur [Railway](https://projetnosql-mango-production.up.railway.app)
- **Base de données :** MySQL (via Prisma ORM) — Railway
- **Authentification :** JWT + bcrypt

---

## ⚙️ Fonctionnalités principales

- 👤 Inscription / connexion avec rôles (`student`, `admin`)
- 🍔 Liste et gestion des plats (CRUD)
- 🧾 Commandes (création, suivi, suppression)
- 📊 Tableau de bord administrateur

---

## 🔧 Installation locale

```bash
git clone https://github.com/matteolvt/Projet_Nosql-Mango.git
cd Projet_Nosql-Mango
```

Pour démarrer le back :

cd back-end
npm install
npx prisma generate
npm run dev

Pour démarrer le front :

cd DeliveCROUS
npm install
npm run dev

Auteurs :

Mattéo Livrozet
Tom Julliat

// main.js
import { PrismaClient } from "@prisma/client";
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();


let prisma;
async function initPrisma() {
  for (let i = 0; i < 5; i++) {
    try {
      prisma = new PrismaClient();
      await prisma.$connect();
      console.log("✅ Prisma connecté à la base !");
      return prisma;
    } catch (error) {
      console.error("⏳ Tentative Prisma échouée, retry...", i + 1);
      await new Promise((r) => setTimeout(r, 2000)); // attend 2s avant retry
    }
  }
  throw new Error("❌ Échec de connexion à Prisma après 5 tentatives");
}

export default await initPrisma();

app.get("/", (req, res) => {
  res.send("🚀 API DeliveCROUS en ligne et connectée à Railway !");
});

/* ----------------------  MIDDLEWARES GLOBAUX ---------------------- */
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

/* ----------------------  MIDDLEWARES ---------------------- */


function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = decoded;
    next();
  });
}


function verifyAdmin(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Accès réservé aux administrateurs" });
  next();
}

/* ----------------------  HEALTHCHECK ---------------------- */
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "development" });
});

/* ----------------------  USERS ---------------------- */

app.get("/api/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { commandes: true, favoris: true },
    });
    const safeUsers = users.map(({ password, ...rest }) => rest);
    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { commandes: true, favoris: true },
    });

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    if (req.user.userId !== user.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Non autorisé" });

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { email, password, nom, prenom, role } = req.body;
    if (!email || !password || !nom || !prenom)
      return res.status(400).json({ error: "Champs manquants" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        role: role || "student",
      },
    });

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/users/:id", verifyToken, async (req, res) => {
  try {
    const { password, ...data } = req.body;
    if (req.user.userId !== req.params.id && req.user.role !== "admin")
      return res.status(403).json({ error: "Non autorisé" });

    const updatedData = { ...data };
    if (password) updatedData.password = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updatedData,
    });

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: "Impossible de modifier l'utilisateur" });
  }
});

app.delete("/api/users/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Impossible de supprimer l'utilisateur" });
  }
});

/* ----------------------  AUTH ---------------------- */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email et mot de passe requis" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Email ou mot de passe invalide" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Email ou mot de passe invalide" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/auth/me", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        commandes: {
          include: {
            plats: {
              include: {
                plat: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error("Erreur /auth/me :", err);
    res.status(500).json({ error: "Erreur lors du chargement de l'utilisateur" });
  }
});

/* ----------------------  PLATS ---------------------- */

app.get("/api/plats", async (req, res) => {
  try {
    const plats = await prisma.plat.findMany();
    res.json(plats);
  } catch (error) {
    console.error("Erreur serveur détaillée :", error);
    res.status(500).json({ error: error.message, details: error });
  }
});

app.get("/api/plats/:id", async (req, res) => {
  try {
    const plat = await prisma.plat.findUnique({ where: { id: req.params.id } });
    if (!plat) return res.status(404).json({ error: "Plat introuvable" });
    res.json(plat);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/api/plats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { nom, description, prix, categorie, allergenes, image } = req.body;
    if (!nom || !description || prix == null || !categorie)
      return res.status(400).json({ error: "Champs manquants" });

    const plat = await prisma.plat.create({
      data: {
        nom,
        description,
        prix: parseFloat(prix),
        categorie,
        allergenes,
        image,
      },
    });
    res.json(plat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/plats/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await prisma.plat.delete({ where: { id: req.params.id } });
    res.json({ message: "Plat supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Impossible de supprimer le plat" });
  }
});

app.put("/api/plats/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, prix, categorie, allergenes, image, disponible } = req.body;

    const plat = await prisma.plat.update({
      where: { id },
      data: {
        nom,
        description,
        prix: parseFloat(prix),
        categorie,
        allergenes,
        image,
        disponible: disponible ?? true,
      },
    });

    res.json(plat);
  } catch (err) {
    console.error("Erreur lors de la modification du plat :", err);
    res.status(500).json({ error: "Impossible de modifier le plat" });
  }
});


/* ----------------------  COMMANDES ---------------------- */

app.post("/api/commandes", verifyToken, async (req, res) => {
  try {
    const { pointLivraison, plats } = req.body;
    if (!plats || plats.length === 0)
      return res.status(400).json({ error: "Aucun plat fourni" });

    const total = plats.reduce((acc, p) => acc + p.prixUnitaire * p.quantite, 0);

    const commande = await prisma.commande.create({
      data: {
        userId: req.user.userId,
        pointLivraison,
        total,
        plats: {
          create: plats.map((p) => ({
            platId: p.platId,
            quantite: p.quantite,
            prixUnitaire: p.prixUnitaire,
          })),
        },
      },
      include: { plats: { include: { plat: true } } },
    });

    res.json(commande);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la création de la commande" });
  }
});

app.get("/api/commandes", verifyToken, async (req, res) => {
  try {
    const { userId, role } = req.user;

    let commandes;

    if (role === "admin") {
      // 👑 Admin → toutes les commandes
      commandes = await prisma.commande.findMany({
        include: {
          user: { select: { id: true, nom: true, prenom: true, email: true } },
          plats: { include: { plat: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // 👤 Student → uniquement ses commandes
      commandes = await prisma.commande.findMany({
        where: { userId },
        include: {
          plats: { include: { plat: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(commandes);
  } catch (err) {
    console.error("Erreur récupération commandes :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des commandes" });
  }
});


app.put("/api/commandes/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const validStatuts = ["en attente", "en cours", "livrée"];
    if (!validStatuts.includes(statut))
      return res.status(400).json({ error: "Statut invalide" });

    const commande = await prisma.commande.update({
      where: { id },
      data: { statut },
    });

    res.json(commande);
  } catch (err) {
    console.error("Erreur maj statut:", err);
    res.status(500).json({ error: "Impossible de modifier la commande" });
  }
});

app.delete("/api/commandes/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const commandeId = req.params.id;

    await prisma.commandePlat.deleteMany({ where: { commandeId } });
    await prisma.commande.delete({ where: { id: commandeId } });

    res.json({ message: "Commande supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Impossible de supprimer la commande" });
  }
});

app.put("/api/commandes/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const commandeId = req.params.id;
    const { statut, pointLivraison } = req.body;

    const existing = await prisma.commande.findUnique({
      where: { id: commandeId },
    });
    if (!existing)
      return res.status(404).json({ error: "Commande introuvable" });

    const validStatuts = ["en attente", "en cours", "livrée"];

    const updateData = {};

    if (statut && validStatuts.includes(statut.toLowerCase())) {
      updateData.statut = statut.toLowerCase();
    }

    if (typeof pointLivraison === "string" && pointLivraison.trim() !== "") {
      updateData.pointLivraison = pointLivraison.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "Aucun champ valide à mettre à jour" });
    }

    const updatedCommande = await prisma.commande.update({
      where: { id: commandeId },
      data: updateData,
      include: {
        user: { select: { id: true, nom: true, prenom: true, email: true } },
        plats: { include: { plat: true } },
      },
    });

    console.log("✅ Commande mise à jour :", updateData);
    res.json(updatedCommande);
  } catch (err) {
    console.error("❌ Erreur update commande :", err);
    res.status(500).json({ error: "Impossible de modifier la commande" });
  }
});



/* ----------------------  ADMIN ---------------------- */

app.get("/api/admin/stats", verifyToken, verifyAdmin, async (_req, res) => {
  try {
    const [users, plats, commandes] = await Promise.all([
      prisma.user.count(),
      prisma.plat.count(),
      prisma.commande.count(),
    ]);
    res.json({ utilisateurs: users, plats, commandes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------  LANCEMENT ---------------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
});

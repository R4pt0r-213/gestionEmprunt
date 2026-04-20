const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion PostgreSQL — Render injecte automatiquement DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Init DB
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS emprunts (
      id SERIAL PRIMARY KEY,
      prenom TEXT NOT NULL,
      nom TEXT NOT NULL,
      item TEXT NOT NULL,
      qty INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('Base de données prête');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET tous les emprunts
app.get('/api/emprunts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM emprunts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST nouvel emprunt
app.post('/api/emprunts', async (req, res) => {
  const { prenom, nom, item, qty = 1 } = req.body;
  if (!prenom || !nom || !item) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO emprunts (prenom, nom, item, qty) VALUES ($1, $2, $3, $4) RETURNING *',
      [prenom.trim(), nom.trim(), item.trim(), parseInt(qty) || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE un emprunt (rendu)
app.delete('/api/emprunts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM emprunts WHERE id = $1 RETURNING *', [parseInt(id)]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Emprunt introuvable' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
});

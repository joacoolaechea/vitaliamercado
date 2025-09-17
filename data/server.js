const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVnd3iRmCdp6dgsxtrXgzLSKgAhQfExgute0iiXotc2HOp8WkMhk3A0nhMS3iSEDG9Q-jDiO38YF8A/pub?gid=2069375949&single=true&output=csv';

app.get('/api/products', async (req, res) => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error('No se pudo descargar el CSV');

    const results = [];

    response.body
      .pipe(csv())
      .on('data', (row) => {
        const name = row["Name"]?.trim();
        if (!name) return;

        const rawPrice = (row["Price"] || "0").replace(/,/g, '');
        const price = parseFloat(rawPrice);

        results.push({
          name,
          category: row["ProductGroup"]?.trim() || "SIN CATEGORÍA",
          price: isNaN(price) ? 0 : price,
          unit: row["MeasurementUnit"]?.trim() || "Unidad",
          image: (() => {
            const raw = (row["Image"] || "").trim();
            if (!raw) return "";
            if (/\.(jpg|jpeg|png|webp)$/i.test(raw)) return raw;
            const match = raw.match(/(?:imgur\.com\/)?([a-zA-Z0-9]+)/);
            const id = match ? match[1] : raw;
            return `https://i.imgur.com/${id}.jpg`;
          })(),
          publicidad: (() => {
            const raw = (row["Publicidad"] || "").trim();
            if (!raw) return "";
            if (/\.(jpg|jpeg|png|webp)$/i.test(raw)) return raw;
            const match = raw.match(/(?:imgur\.com\/)?([a-zA-Z0-9]+)/);
            const id = match ? match[1] : raw;
            return `https://i.imgur.com/${id}.jpg`;
          })(),
          destacado: (() => {
            const raw = (row["Destacado"] || "").trim().toLowerCase();
            // Puede ser "SI", "TRUE", "1" para marcar como destacado
            return ["si", "true", "1"].includes(raw);
          })()
        });
      })
      .on('end', () => res.json(results))
      .on('error', (err) => {
        console.error("Error procesando CSV:", err);
        res.status(500).json({ error: "Error procesando CSV" });
      });

  } catch (err) {
    console.error("Error descargando CSV:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

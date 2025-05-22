const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

console.log("Iniciando servidor...");

app.get('/api/products', (req, res) => {
  const results = [];

  fs.createReadStream(path.join(__dirname, 'bdv.csv'))
    .pipe(csv())
    .on('data', (row) => {
      const name = row["Name"]?.trim();
      if (!name) return; // Salta filas vacías

      // Limpia y convierte precio a número
      const rawPrice = (row["Price"] || "0").replace(/,/g, '');
      const price = parseFloat(rawPrice);

      results.push({
        name: name,
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
        })()
      });
    })
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      console.error("Error procesando CSV:", err);
      res.status(500).json({ error: "Error procesando CSV" });
    });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

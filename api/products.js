const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

module.exports = async (req, res) => {
  const results = [];

  const filePath = path.join(__dirname, 'bdv.csv');

  try {
    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on('data', (row) => {
      const name = row["Name"]?.trim();
      if (!name) return;

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
    });

    stream.on('end', () => {
      res.status(200).json(results);
    });

    stream.on('error', (err) => {
      console.error("Error al procesar CSV:", err);
      res.status(500).json({ error: "Error al procesar CSV" });
    });

  } catch (err) {
    console.error("Error general:", err);
    res.status(500).json({ error: "Error al leer CSV" });
  }
};

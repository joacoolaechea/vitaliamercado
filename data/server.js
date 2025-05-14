const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// La carpeta 'public' está una carpeta arriba desde 'data'
app.use(express.static(path.join(__dirname, '..', 'public')));

// Leer el CSV desde la misma carpeta 'data'
console.log("Iniciando servidor...");
app.get('/api/products', (req, res) => {
  const results = [];
  fs.createReadStream(path.join(__dirname, 'bdv.csv'))
    .pipe(csv())
    .on('data', (row) => {
      results.push({
        name: row["Name"],
        category: row["ProductGroup"],
        price: row["Price"],
        unit: row["MeasurementUnit"]
      });
    })
    .on('end', () => {
      res.json(results);
    });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

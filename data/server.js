const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;  // Usa el puerto que asigne Render o 3000 local

// Sirve archivos estáticos desde la carpeta 'public' (que está una carpeta arriba de 'data')
app.use(express.static(path.join(__dirname, '..', 'public')));

console.log("Iniciando servidor...");

app.get('/api/products', (req, res) => {
  const results = [];
  fs.createReadStream(path.join(__dirname, 'bdv.csv'))
    .pipe(csv())
    .on('data', (row) => {
      console.log("Fila:", row);
      results.push({
        name: row["Name"],
        category: row["ProductGroup"],
        price: row["Price"],
        unit: row["MeasurementUnit"],
        image: row["Image"] || ""  // Aquí si no existe pone vacío
      });
    })
    .on('end', () => {
      res.json(results);
    });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

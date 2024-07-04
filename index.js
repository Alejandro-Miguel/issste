const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Leer el archivo JSON
const dataFilePath = path.join(__dirname, 'data.json');
let data = [];

fs.readFile(dataFilePath, 'utf8', (err, jsonData) => {
  if (err) {
    console.error('Error al leer el archivo JSON', err);
    return;
  }
  try {
    data = JSON.parse(jsonData);
    //console.log('Datos cargados:', data); // Agregar este log para verificar los datos
  } catch (err) {
    console.error('Error al parsear el archivo JSON', err);
  }
});

// Ruta de búsqueda
app.get('/search', (req, res) => {
  const query = req.query.q;
  const leyId = parseInt(req.query.leyId, 10);
  if (!query) {
    return res.status(400).send({ error: 'Parámetro de búsqueda es requerido' });
  }

  const results = [];
  
  data.forEach(ley => {
    if (ley.id === leyId) {
      ley.characteristics.forEach(characteristic => {
        const { title, contenido } = characteristic;
        if ((title && title === query) || (contenido && contenido.includes(query))) {
          results.push({
            category: ley.category,
            id: characteristic.id,
            title: characteristic.title,
            content: characteristic.content
          });
        }
      });
    }
  });
  // console.log('Resultados de búsqueda:', results); // Agregar este log para verificar los resultados
  res.send(results);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
// Modelo de Mongoose para representar a un deportista en la base de datos
const mongoose = require('mongoose');

// Definimos la estructura que tendrán los documentos de deportistas
const deportistaSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    edad: Number,
    categoria: String,
});

// Exportamos el modelo para poder usarlo en los controladores y rutas
module.exports = mongoose.model('Deportista', deportistaSchema);

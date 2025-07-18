// Importamos los módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env

const app = express();

// ===== MIDDLEWARE =====
// Permite que nuestro servidor acepte datos en formato JSON
app.use(express.json());
// Permite que el frontend se comunique con este backend sin errores de origen (CORS)
app.use(cors());

// ===== RUTAS =====
// Usamos las rutas que creamos para gestionar los deportistas
const deportistasRoutes = require('./routes/deportistas');
app.use('/api/deportistas', deportistasRoutes);

// Si alguien intenta acceder a una ruta que no existe, mostramos un error 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// ===== CONEXIÓN A MONGODB =====
// Nos conectamos a MongoDB Atlas usando la URL guardada en el archivo .env
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'MiBD', // Nombre de la base de datos que vamos a usar
})
.then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    console.log('📁 Base de datos usada:', mongoose.connection.name);
})
.catch((err) => {
    console.error('❌ Error de conexión con MongoDB:', err);
    process.exit(1); // Si no se conecta, detenemos la app
});

// ===== INICIAR SERVIDOR =====
// El servidor se pone en marcha en el puerto indicado (desde .env o 3000 por defecto)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

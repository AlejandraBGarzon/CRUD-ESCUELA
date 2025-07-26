// Importamos express y creamos un enrutador
const express = require('express');
const router = express.Router();

// Importamos el modelo de deportista para interactuar con la base de datos
const Deportista = require('../models/Deportista');

// ===============================
// ======= RUTAS CRUD API ========
// ===============================

// Obtener todos los deportistas
router.get('/', async (req, res) => {
    try {
        const deportistas = await Deportista.find(); // Busca todos los registros
        console.log(`📥 GET /api/deportistas → Se obtuvieron ${deportistas.length} deportistas`);
        res.status(200).json(deportistas); // Responde con los datos
    } catch (error) {
        console.error('❌ Error al obtener deportistas:', error.message);
        res.status(500).json({ error: 'Error al obtener deportistas' });
    }
});

// Crear un nuevo deportista
router.post('/', async (req, res) => {
    try {
        const nuevo = new Deportista(req.body); // Crea un nuevo objeto con los datos recibidos
        await nuevo.save(); // Lo guarda en la base de datos
        console.log(`✅ POST /api/deportistas → Deportista creado: ${nuevo.nombre} ${nuevo.apellido}`);
        res.status(201).json(nuevo); // Responde con el nuevo objeto creado
    } catch (error) {
        console.error('❌ Error al crear deportista:', error.message);
        res.status(400).json({ error: 'Error al crear deportista' });
    }
});

// Actualizar un deportista por su ID
router.put('/:id', async (req, res) => {
    try {
        // Busca el deportista por su ID y actualiza con los nuevos datos
        const actualizado = await Deportista.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!actualizado) {
            console.log(`⚠️ PUT /api/deportistas/${req.params.id} → Deportista no encontrado`);
            return res.status(404).json({ error: 'Deportista no encontrado' });
        }

        console.log(`🔁 PUT /api/deportistas/${req.params.id} → Deportista actualizado`);
        res.status(200).json(actualizado);
    } catch (error) {
        console.error(`❌ Error al actualizar deportista: ${error.message}`);
        res.status(400).json({ error: 'Error al actualizar deportista' });
    }
});

// Eliminar un deportista por su ID
router.delete('/:id', async (req, res) => {
    try {
        // Busca y elimina al deportista por su ID
        const eliminado = await Deportista.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            console.log(`⚠️ DELETE /api/deportistas/${req.params.id} → Deportista no encontrado`);
            return res.status(404).json({ error: 'Deportista no encontrado' });
        }

        console.log(`🗑️ DELETE /api/deportistas/${req.params.id} → Deportista eliminado`);
        res.status(200).json({ mensaje: 'Deportista eliminado correctamente' });
    } catch (error) {
        console.error(`❌ Error al eliminar deportista: ${error.message}`);
        res.status(500).json({ error: 'Error al eliminar deportista' });
    }
});

// Exportamos las rutas para usarlas en el servidor principal
module.exports = router;

const express = require('express');
const router = express.Router();
const negocioService = require('../repositories/NegocioRepository');

router.post('/negocios', async (req, res) => {
    try {
        const negocio = req.body;
        await negocioService.crearNegocio(negocio);

        res.status(201).json({
            mensaje: 'Negocio creado con éxito',
            negocio
        });
    } catch (error) {
        console.error('Error creando negocio:', error);
        res.status(400).json({ error: error.message });
    }
});

router.get('/negocios', async (req, res) => {
    try {
        const { idNegocio, idUsuario } = req.query;

        if (idNegocio) {
            const negocio = await negocioService.obtenerNegocioPorId(parseInt(idNegocio));
            if (!negocio) return res.status(404).json({ error: 'Negocio no encontrado' });
            return res.status(200).json(negocio);
        }

        if (idUsuario) {
            const negocios = await negocioService.obtenerNegociosPorUsuario(parseInt(idUsuario));
            return res.status(200).json(negocios);
        }

        // Consulta pública para que los clientes puedan escoger un negocio.
        const negocios = await negocioService.obtenerNegocios();
        return res.status(200).json(negocios);
    } catch (error) {
        console.error('Error obteniendo negocios:', error);
        res.status(500).json({ error: error.message });
    }
});

router.put('/negocios', async (req, res) => {
    try {
        const idNegocio = parseInt(req.query.idNegocio);
        const negocio = { ...req.body, idNegocio };

        await negocioService.actualizarNegocio(negocio);

        res.status(200).json({
            mensaje: 'Negocio actualizado correctamente',
            negocio
        });
    } catch (error) {
        console.error('Error actualizando negocio:', error);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/negocios', async (req, res) => {
    try {
        const idNegocio = parseInt(req.query.idNegocio);
        const idUsuario = parseInt(req.query.idUsuario);

        if (!idNegocio || !idUsuario) {
            return res.status(400).json({ error: 'idNegocio e idUsuario son obligatorios' });
        }

        await negocioService.eliminarNegocio(idNegocio, idUsuario);
        res.status(200).json({ mensaje: 'Negocio eliminado' });
    } catch (error) {
        console.error('Error eliminando negocio:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

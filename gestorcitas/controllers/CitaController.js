const express = require('express');
const router = express.Router();
const citaService = require('../repositories/CitaRepository');

router.post('/citas', async (req, res) => {
    try {
        const cita = req.body;
        await citaService.crearCita(cita);
        res.status(201).json({ mensaje: 'Cita creada correctamente', cita });
    } catch (error) {
        console.error('Error creando cita:', error);
        res.status(400).json({ error: error.message });
    }
});

router.get('/citas', async (req, res) => {
    try {
        const { idCita, telefono, idNegocio } = req.query;

        if (idCita) {
            const cita = await citaService.obtenerCitaPorId(parseInt(idCita));
            return res.status(200).json(cita);
        }

        if (telefono) {
            const citas = await citaService.obtenerCitasPorTelefono(telefono);
            return res.status(200).json(citas);
        }

        if (idNegocio) {
            const citas = await citaService.obtenerCitasPorNegocio(parseInt(idNegocio));
            return res.status(200).json(citas);
        }

        const citas = await citaService.obtenerCitas();
        return res.status(200).json(citas);
    } catch (error) {
        console.error('Error obteniendo citas:', error);
        res.status(400).json({ error: error.message });
    }
});

router.put('/citas', async (req, res) => {
    try {
        const idCita = parseInt(req.query.idCita);
        if (!idCita) return res.status(400).json({ error: 'idCita es obligatorio' });

        const cita = { ...req.body, idCita };
        await citaService.actualizarCita(cita);
        res.status(200).json({ mensaje: 'Cita actualizada correctamente', cita });
    } catch (error) {
        console.error('Error actualizando cita:', error);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/citas', async (req, res) => {
    try {
        const idCita = parseInt(req.query.idCita);
        if (!idCita) return res.status(400).json({ error: 'idCita es obligatorio' });

        await citaService.eliminarCita(idCita);
        res.status(200).json({ mensaje: 'Cita eliminada' });
    } catch (error) {
        console.error('Error eliminando cita:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

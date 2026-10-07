const express = require('express');
const router = express.Router();
const usuarioRepository = require('../repositories/UsuarioRepository');

router.post('/registro', async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;

        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
        }

        const correoLimpio = correo.trim().toLowerCase();
        const existe = await usuarioRepository.buscarPorCorreo(correoLimpio);

        if (existe) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const usuarioCreado = await usuarioRepository.crearUsuario({
            nombre: nombre.trim(),
            correo: correoLimpio,
            contrasena,
            rol: 'administrador'
        });

        res.status(201).json({
            mensaje: 'Cuenta creada con éxito. Ahora puedes iniciar sesión.',
            usuario: usuarioCreado
        });
    } catch (error) {
        console.error('Error en /registro:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
        }

        const usuario = await usuarioRepository.buscarPorCorreo(correo.trim().toLowerCase());

        if (!usuario || usuario.contrasena !== contrasena) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }

        res.status(200).json({
            mensaje: 'Inicio de sesión correcto',
            idUsuario: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
        });
    } catch (error) {
        console.error('Error en /login:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

const db = require('../config/database');

const usuarioRepository = {
    async buscarPorCorreo(correo) {
        const sql = 'SELECT * FROM usuarios WHERE LOWER(correo) = LOWER($1)';
        const resultado = await db.query(sql, [correo]);
        return resultado.rows[0] || null;
    },

    async crearUsuario(usuario) {
        const sql = `
            INSERT INTO usuarios (nombre, correo, contrasena, rol)
            OUTPUT INSERTED.id_usuario, INSERTED.nombre, INSERTED.correo, INSERTED.rol
            VALUES ($1, $2, $3, $4)
        `;

        const resultado = await db.query(sql, [
            usuario.nombre,
            usuario.correo,
            usuario.contrasena,
            usuario.rol
        ]);

        return resultado.rows[0];
    }
};

module.exports = usuarioRepository;

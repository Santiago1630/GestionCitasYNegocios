const db = require('../config/database');

const negocioRepository = {
    async crearNegocio(negocio) {
        if (!negocio.idUsuario) throw new Error('El usuario dueño es obligatorio');
        if (!negocio.nombre || !negocio.nombre.trim()) throw new Error('El nombre es obligatorio');
        if (!negocio.tipoNegocio || !negocio.tipoNegocio.trim()) throw new Error('El tipo de negocio es obligatorio');
        if (!negocio.direccion || !negocio.direccion.trim()) throw new Error('La dirección es obligatoria');
        if (!negocio.telefono || !negocio.telefono.trim()) throw new Error('El teléfono es obligatorio');
        if (!negocio.cantidadEmpleados || negocio.cantidadEmpleados <= 0) {
            throw new Error('Cantidad de empleados inválida');
        }

        const sql = `
            INSERT INTO negocio
            (nombre, tipo_negocio, direccion, telefono, cantidad_empleados, id_usuario)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        await db.query(sql, [
            negocio.nombre.trim(),
            negocio.tipoNegocio.trim(),
            negocio.direccion.trim(),
            negocio.telefono.trim(),
            negocio.cantidadEmpleados,
            negocio.idUsuario
        ]);
    },

    async obtenerNegocios() {
        const sql = 'SELECT * FROM negocio ORDER BY id_negocio ASC';
        const resultado = await db.query(sql);
        return resultado.rows;
    },

    async obtenerNegociosPorUsuario(idUsuario) {
        const sql = `
            SELECT * FROM negocio
            WHERE id_usuario = $1
            ORDER BY id_negocio ASC
        `;
        const resultado = await db.query(sql, [idUsuario]);
        return resultado.rows;
    },

    async obtenerNegocioPorId(idNegocio) {
        const sql = 'SELECT * FROM negocio WHERE id_negocio = $1';
        const resultado = await db.query(sql, [idNegocio]);
        return resultado.rows[0] || null;
    },

    async obtenerNegocioPorIdYUsuario(idNegocio, idUsuario) {
        const sql = `
            SELECT * FROM negocio
            WHERE id_negocio = $1 AND id_usuario = $2
        `;
        const resultado = await db.query(sql, [idNegocio, idUsuario]);
        return resultado.rows[0] || null;
    },

    async actualizarNegocio(negocio) {
        if (!negocio.idNegocio) throw new Error('El id del negocio es obligatorio');
        if (!negocio.idUsuario) throw new Error('El usuario dueño es obligatorio');
        if (!negocio.nombre || !negocio.nombre.trim()) throw new Error('El nombre es obligatorio');
        if (!negocio.tipoNegocio || !negocio.tipoNegocio.trim()) throw new Error('El tipo de negocio es obligatorio');
        if (!negocio.direccion || !negocio.direccion.trim()) throw new Error('La dirección es obligatoria');
        if (!negocio.telefono || !negocio.telefono.trim()) throw new Error('El teléfono es obligatorio');
        if (!negocio.cantidadEmpleados || negocio.cantidadEmpleados <= 0) throw new Error('Cantidad de empleados inválida');

        const existe = await this.obtenerNegocioPorIdYUsuario(negocio.idNegocio, negocio.idUsuario);
        if (!existe) throw new Error('No existe el negocio o no pertenece al usuario');

        const sql = `
            UPDATE negocio
            SET nombre=$1,
                tipo_negocio=$2,
                direccion=$3,
                telefono=$4,
                cantidad_empleados=$5
            WHERE id_negocio=$6 AND id_usuario=$7
        `;

        await db.query(sql, [
            negocio.nombre.trim(),
            negocio.tipoNegocio.trim(),
            negocio.direccion.trim(),
            negocio.telefono.trim(),
            negocio.cantidadEmpleados,
            negocio.idNegocio,
            negocio.idUsuario
        ]);
    },

    async eliminarNegocio(idNegocio, idUsuario) {
        const existe = await this.obtenerNegocioPorIdYUsuario(idNegocio, idUsuario);
        if (!existe) throw new Error('No existe el negocio o no pertenece al usuario');

        const sql = 'DELETE FROM negocio WHERE id_negocio = $1 AND id_usuario = $2';
        await db.query(sql, [idNegocio, idUsuario]);
    }
};

module.exports = negocioRepository;

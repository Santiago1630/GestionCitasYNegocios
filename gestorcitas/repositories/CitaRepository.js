const db = require('../config/database');
const negocioRepository = require('./NegocioRepository');

const citaRepository = {
    async crearCita(cita) {
        if (!cita.nombreCliente || !cita.nombreCliente.trim()) throw new Error('El nombre del cliente es obligatorio');
        if (!cita.telefono || !cita.telefono.trim()) throw new Error('El teléfono es obligatorio');
        if (!cita.tipoServicio || !cita.tipoServicio.trim()) throw new Error('El tipo de servicio es obligatorio');
        if (!cita.fecha || !cita.fecha.trim()) throw new Error('La fecha es obligatoria');
        if (!cita.hora || !cita.hora.trim()) throw new Error('La hora es obligatoria');
        if (!cita.idNegocio) throw new Error('Debe seleccionar un negocio');

        const negocioExiste = await negocioRepository.obtenerNegocioPorId(cita.idNegocio);
        if (!negocioExiste) throw new Error('El negocio no existe');

        cita.estado = 'Pendiente';

        const sql = `
            INSERT INTO citas
            (nombre_cliente, telefono, tipo_servicio, estado, fecha, hora, id_negocio)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        await db.query(sql, [
            cita.nombreCliente.trim(),
            cita.telefono.trim(),
            cita.tipoServicio.trim(),
            cita.estado,
            cita.fecha,
            cita.hora,
            cita.idNegocio
        ]);
    },

    async obtenerCitas() {
        const resultado = await db.query('SELECT * FROM citas ORDER BY id_cita ASC');
        return resultado.rows;
    },

    async obtenerCitaPorId(idCita) {
        const resultado = await db.query('SELECT * FROM citas WHERE id_cita = $1', [idCita]);
        if (resultado.rows.length === 0) throw new Error('No existe la cita');
        return resultado.rows[0];
    },

    async obtenerCitasPorNegocio(idNegocio) {
        const resultado = await db.query('SELECT * FROM citas WHERE id_negocio = $1 ORDER BY fecha, hora', [idNegocio]);
        return resultado.rows;
    },

    async obtenerCitasPorTelefono(telefono) {
        const resultado = await db.query(
            'SELECT * FROM citas WHERE telefono = $1 ORDER BY fecha, hora',
            [telefono.trim()]
        );
        return resultado.rows;
    },

    async actualizarCita(cita) {
        await this.obtenerCitaPorId(cita.idCita);

        if (!cita.nombreCliente || !cita.nombreCliente.trim()) throw new Error('El nombre del cliente es obligatorio');
        if (!cita.telefono || !cita.telefono.trim()) throw new Error('El teléfono es obligatorio');
        if (!cita.tipoServicio || !cita.tipoServicio.trim()) throw new Error('El tipo de servicio es obligatorio');
        if (!cita.fecha || !cita.fecha.trim()) throw new Error('La fecha es obligatoria');
        if (!cita.hora || !cita.hora.trim()) throw new Error('La hora es obligatoria');
        if (!cita.idNegocio) throw new Error('Debe seleccionar un negocio');

        const negocioExiste = await negocioRepository.obtenerNegocioPorId(cita.idNegocio);
        if (!negocioExiste) throw new Error('El negocio no existe');

        const sql = `
            UPDATE citas
            SET nombre_cliente=$1,
                telefono=$2,
                tipo_servicio=$3,
                estado=$4,
                fecha=$5,
                hora=$6,
                id_negocio=$7
            WHERE id_cita=$8
        `;

        await db.query(sql, [
            cita.nombreCliente.trim(),
            cita.telefono.trim(),
            cita.tipoServicio.trim(),
            cita.estado || 'Pendiente',
            cita.fecha,
            cita.hora,
            cita.idNegocio,
            cita.idCita
        ]);
    },

    async eliminarCita(idCita) {
        await this.obtenerCitaPorId(idCita);
        await db.query('DELETE FROM citas WHERE id_cita = $1', [idCita]);
    }
};

module.exports = citaRepository;

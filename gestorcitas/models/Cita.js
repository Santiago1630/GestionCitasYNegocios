class Cita {
    constructor(idCita, nombreCliente, telefono, tipoServicio, estado, fecha, hora, idNegocio) {
        this.idCita = idCita;
        this.nombreCliente = nombreCliente;
        this.telefono = telefono;
        this.tipoServicio = tipoServicio;
        this.estado = estado;
        this.fecha = fecha;
        this.hora = hora;
        this.idNegocio = idNegocio;
    }
}

module.exports = Cita;

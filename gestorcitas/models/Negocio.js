class Negocio {
    constructor(idNegocio, nombre, tipoNegocio, direccion, telefono, cantidadEmpleados, idUsuario) {
        this.idNegocio = idNegocio;
        this.nombre = nombre;
        this.tipoNegocio = tipoNegocio;
        this.direccion = direccion;
        this.telefono = telefono;
        this.cantidadEmpleados = cantidadEmpleados;
        this.idUsuario = idUsuario;
    }
}

module.exports = Negocio;

class Usuario {
    constructor(idUsuario, nombre, correo, contrasena, rol) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.correo = correo;
        this.contrasena = contrasena;
        this.rol = rol;
    }
}

module.exports = Usuario;

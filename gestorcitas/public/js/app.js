const API_URL = '/api';

let idCitaEditando = null;
let modoRegistro = false;

const $ = id => document.getElementById(id);

function mostrarToast(mensaje, tipo = 'success') {
    const toast = $('toast');
    toast.textContent = mensaje;
    toast.className = `toast show ${tipo}`;
    setTimeout(() => toast.classList.remove('show'), 3200);
}

function mostrarMensaje(id, mensaje, tipo = 'success') {
    const elemento = $(id);
    elemento.textContent = mensaje;
    elemento.className = `form-message ${tipo}`;
}

function ocultarMensaje(id) {
    $(id).classList.add('hidden');
}

function obtenerIdUsuario() {
    return parseInt(sessionStorage.getItem('idUsuario')) || null;
}

function mostrarVistaCliente() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mostrarVistaAdmin() {
    $('administrador').scrollIntoView({ behavior: 'smooth' });
    verificarAccesoAdmin();
}

async function cargarNegociosPublicos() {
    try {
        const res = await fetch(`${API_URL}/negocios`);
        const negocios = await res.json();

        if (!res.ok) throw new Error(negocios.error || 'No se pudieron cargar los negocios');

        const select = $('selectNegocio');
        select.innerHTML = '<option value="">Selecciona un negocio...</option>';

        if (!negocios.length) {
            select.innerHTML = '<option value="">No hay negocios registrados</option>';
            return;
        }

        negocios.forEach(n => {
            select.innerHTML += `<option value="${n.id_negocio}">${escapeHtml(n.nombre)} · ${escapeHtml(n.tipo_negocio)}</option>`;
        });
    } catch (error) {
        console.error(error);
        $('selectNegocio').innerHTML = '<option value="">No fue posible cargar los negocios</option>';
        mostrarToast('No se pudieron cargar los negocios.', 'error');
    }
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function verificarAccesoAdmin() {
    const idUsuario = obtenerIdUsuario();
    const nombre = sessionStorage.getItem('adminLogueado');

    if (idUsuario && nombre) {
        $('seccionLoginAdmin').classList.add('hidden');
        $('panelAdmin').classList.remove('hidden');
        $('nombreAdminLogueado').textContent = nombre;
        cargarNegociosAdmin();
    } else {
        $('seccionLoginAdmin').classList.remove('hidden');
        $('panelAdmin').classList.add('hidden');
    }
}

$('formLoginAdmin').addEventListener('submit', async event => {
    event.preventDefault();
    ocultarMensaje('authMensaje');

    const correo = $('correoAdmin').value.trim();
    const contrasena = $('contrasenaAdmin').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });

        const data = await res.json();

        if (!res.ok) {
            mostrarMensaje('authMensaje', data.error || 'No se pudo iniciar sesión.', 'error');
            return;
        }

        if (data.rol !== 'administrador') {
            mostrarMensaje('authMensaje', 'La cuenta no tiene permisos de administrador.', 'error');
            return;
        }

        sessionStorage.setItem('idUsuario', data.idUsuario);
        sessionStorage.setItem('adminLogueado', data.nombre);
        sessionStorage.setItem('adminCorreo', data.correo);

        $('formLoginAdmin').reset();
        verificarAccesoAdmin();
        mostrarToast('Sesión iniciada correctamente.');
    } catch (error) {
        console.error(error);
        mostrarMensaje('authMensaje', 'No se pudo conectar con el servidor.', 'error');
    }
});

function cerrarSesionAdmin() {
    sessionStorage.removeItem('idUsuario');
    sessionStorage.removeItem('adminLogueado');
    sessionStorage.removeItem('adminCorreo');
    $('formLoginAdmin').reset();
    $('formRegistroAdmin').reset();
    verificarAccesoAdmin();
    mostrarToast('Sesión cerrada.');
}

function alternarModoAuth(event) {
    event.preventDefault();
    modoRegistro = !modoRegistro;

    const titulo = $('tituloLogin');
    const texto = $('textoLogin');
    const login = $('formLoginAdmin');
    const registro = $('formRegistroAdmin');
    const enlace = $('enlaceCambiarModo');

    ocultarMensaje('authMensaje');

    if (modoRegistro) {
        titulo.textContent = 'Crear cuenta de administrador';
        texto.textContent = 'Registra tu cuenta para comenzar a gestionar tus negocios.';
        login.classList.add('hidden');
        registro.classList.remove('hidden');
        enlace.textContent = '¿Ya tienes cuenta? Inicia sesión';
    } else {
        titulo.textContent = 'Acceso administrador';
        texto.textContent = 'Ingresa con tu cuenta para administrar tus negocios.';
        login.classList.remove('hidden');
        registro.classList.add('hidden');
        enlace.textContent = '¿No tienes cuenta? Regístrate aquí';
    }
}

$('formRegistroAdmin').addEventListener('submit', async event => {
    event.preventDefault();

    const nombre = $('nombreRegistro').value.trim();
    const correo = $('correoRegistro').value.trim();
    const contrasena = $('contrasenaRegistro').value;

    try {
        const res = await fetch(`${API_URL}/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, contrasena })
        });

        const data = await res.json();

        if (!res.ok) {
            mostrarMensaje('authMensaje', data.error || 'No se pudo crear la cuenta.', 'error');
            return;
        }

        $('formRegistroAdmin').reset();
        modoRegistro = true;
        alternarModoAuth({ preventDefault: () => {} });
        mostrarToast('Cuenta creada correctamente. Ahora inicia sesión.');
    } catch (error) {
        console.error(error);
        mostrarMensaje('authMensaje', 'No se pudo conectar con el servidor.', 'error');
    }
});

async function cargarNegociosAdmin() {
    const idUsuario = obtenerIdUsuario();
    if (!idUsuario) return;

    try {
        const res = await fetch(`${API_URL}/negocios?idUsuario=${idUsuario}`);
        const negocios = await res.json();

        if (!res.ok) throw new Error(negocios.error || 'No se pudieron cargar los negocios');

        const contenedor = $('tablaNegociosAdmin');
        $('cantidadNegocios').textContent = negocios.length;

        if (!negocios.length) {
            contenedor.innerHTML = `
                <div class="empty-state">
                    <span>⌂</span>
                    <p>Aún no tienes negocios registrados.</p>
                </div>`;
            return;
        }

        contenedor.innerHTML = negocios.map(n => `
            <article class="business-item">
                <div class="business-item-head">
                    <div>
                        <h4>${escapeHtml(n.nombre)}</h4>
                        <span class="business-type">${escapeHtml(n.tipo_negocio)}</span>
                    </div>
                </div>
                <p>📍 ${escapeHtml(n.direccion)}</p>
                <p>☎ ${escapeHtml(n.telefono)} · ${escapeHtml(n.cantidad_empleados)} empleado(s)</p>
                <div class="business-actions">
                    <button class="small-btn edit-btn" onclick='prepararEditarNegocio(${JSON.stringify(n)})'>Editar</button>
                    <button class="small-btn delete-btn" onclick="eliminarNegocio(${n.id_negocio})">Eliminar</button>
                </div>
            </article>
        `).join('');
    } catch (error) {
        console.error(error);
        mostrarToast('No se pudieron cargar tus negocios.', 'error');
    }
}

$('formNegocio').addEventListener('submit', async event => {
    event.preventDefault();

    const idUsuario = obtenerIdUsuario();
    if (!idUsuario) {
        mostrarToast('Debes iniciar sesión como administrador.', 'error');
        return;
    }

    const id = $('idNegocioEdit').value;
    const negocioData = {
        nombre: $('nombreNegocio').value.trim(),
        tipoNegocio: $('tipoNegocio').value.trim(),
        direccion: $('direccionNegocio').value.trim(),
        telefono: $('telefonoNegocio').value.trim(),
        cantidadEmpleados: parseInt($('empleadosNegocio').value),
        idUsuario
    };

    try {
        const url = id
            ? `${API_URL}/negocios?idNegocio=${id}`
            : `${API_URL}/negocios`;

        const res = await fetch(url, {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(negocioData)
        });

        const data = await res.json();

        if (!res.ok) {
            mostrarMensaje('negocioMensaje', data.error || 'No se pudo guardar el negocio.', 'error');
            return;
        }

        mostrarMensaje('negocioMensaje', id ? 'Negocio actualizado correctamente.' : 'Negocio creado correctamente.', 'success');
        mostrarToast(id ? 'Negocio actualizado.' : 'Negocio creado.');
        resetFormNegocio();
        await cargarNegociosAdmin();
        await cargarNegociosPublicos();
    } catch (error) {
        console.error(error);
        mostrarMensaje('negocioMensaje', 'No se pudo conectar con el servidor.', 'error');
    }
});

function prepararEditarNegocio(n) {
    $('idNegocioEdit').value = n.id_negocio;
    $('nombreNegocio').value = n.nombre;
    $('tipoNegocio').value = n.tipo_negocio;
    $('direccionNegocio').value = n.direccion;
    $('telefonoNegocio').value = n.telefono;
    $('empleadosNegocio').value = n.cantidad_empleados;

    $('tituloFormNegocio').textContent = 'Editar negocio';
    $('btnGuardarNegocio').textContent = 'Actualizar negocio';
    $('btnCancelarEdicion').classList.remove('hidden');
    $('nombreNegocio').focus();
}

function resetFormNegocio() {
    $('formNegocio').reset();
    $('idNegocioEdit').value = '';
    $('tituloFormNegocio').textContent = 'Crear nuevo negocio';
    $('btnGuardarNegocio').textContent = 'Guardar negocio';
    $('btnCancelarEdicion').classList.add('hidden');
}

async function eliminarNegocio(id) {
    const idUsuario = obtenerIdUsuario();
    if (!idUsuario) return;

    const confirmado = confirm('¿Estás seguro de eliminar este negocio? Si tiene citas asociadas, la base de datos podría impedir la eliminación.');
    if (!confirmado) return;

    try {
        const res = await fetch(`${API_URL}/negocios?idNegocio=${id}&idUsuario=${idUsuario}`, {
            method: 'DELETE'
        });

        const data = await res.json();

        if (!res.ok) {
            mostrarToast(data.error || 'No se pudo eliminar el negocio.', 'error');
            return;
        }

        mostrarToast('Negocio eliminado correctamente.');
        await cargarNegociosAdmin();
        await cargarNegociosPublicos();
    } catch (error) {
        console.error(error);
        mostrarToast('No se pudo conectar con el servidor.', 'error');
    }
}

$('formCita').addEventListener('submit', async event => {
    event.preventDefault();

    const citaData = {
        idNegocio: parseInt($('selectNegocio').value),
        nombreCliente: $('nombreCliente').value.trim(),
        telefono: $('telefonoCliente').value.trim(),
        tipoServicio: $('tipoServicio').value.trim(),
        fecha: $('fechaCita').value,
        hora: $('horaCita').value,
        estado: 'Pendiente'
    };

    if (!citaData.idNegocio) {
        mostrarToast('Selecciona un negocio.', 'error');
        return;
    }

    try {
        const url = idCitaEditando
            ? `${API_URL}/citas?idCita=${idCitaEditando}`
            : `${API_URL}/citas`;

        const res = await fetch(url, {
            method: idCitaEditando ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(citaData)
        });

        const data = await res.json();

        if (!res.ok) {
            mostrarToast(data.error || 'No se pudo procesar la cita.', 'error');
            return;
        }

        const telefono = citaData.telefono;
        const estabaEditando = Boolean(idCitaEditando);

        cancelarEdicionCita();
        $('formCita').reset();
        $('buscarTelefono').value = telefono;

        mostrarToast(estabaEditando ? 'Cita actualizada correctamente.' : 'Cita agendada correctamente.');
        await consultarMisCitas();
    } catch (error) {
        console.error(error);
        mostrarToast('No se pudo conectar con el servidor.', 'error');
    }
});

async function consultarMisCitas() {
    const telefono = $('buscarTelefono').value.trim();
    const lista = $('listaMisCitas');

    if (!telefono) {
        lista.innerHTML = '<div class="empty-state"><span>!</span><p>Ingresa un número de teléfono válido.</p></div>';
        return;
    }

    try {
        // El servidor filtra por teléfono. Ya no se descargan todas las citas al navegador.
        const res = await fetch(`${API_URL}/citas?telefono=${encodeURIComponent(telefono)}`);
        const citas = await res.json();

        if (!res.ok) throw new Error(citas.error || 'No se pudieron consultar las citas');

        if (!citas.length) {
            lista.innerHTML = '<div class="empty-state"><span>⌕</span><p>No se encontraron citas para este teléfono.</p></div>';
            return;
        }

        lista.innerHTML = citas.map(c => `
            <article class="appointment-item">
                <div class="appointment-main">
                    <strong>${escapeHtml(c.tipo_servicio)}</strong>
                    <small>${escapeHtml(c.fecha)} · ${escapeHtml(c.hora)} · Estado: ${escapeHtml(c.estado)}</small>
                </div>
                <div class="appointment-actions">
                    <button class="small-btn edit-btn" onclick='prepararEditarCita(${JSON.stringify(c)})'>Editar</button>
                    <button class="small-btn delete-btn" onclick="eliminarCita(${c.id_cita}, '${escapeHtml(telefono)}')">Cancelar</button>
                </div>
            </article>
        `).join('');
    } catch (error) {
        console.error(error);
        lista.innerHTML = '<div class="empty-state"><span>!</span><p>No fue posible consultar las citas.</p></div>';
    }
}

function prepararEditarCita(c) {
    idCitaEditando = c.id_cita;
    $('selectNegocio').value = c.id_negocio;
    $('nombreCliente').value = c.nombre_cliente;
    $('telefonoCliente').value = c.telefono;
    $('tipoServicio').value = c.tipo_servicio;
    $('fechaCita').value = normalizarFecha(c.fecha);
    $('horaCita').value = normalizarHora(c.hora);

    $('btnGuardarCita').textContent = 'Guardar cambios';
    $('btnCancelarEdicionCita').classList.remove('hidden');

    $('agendar').scrollIntoView({ behavior: 'smooth' });
}

function normalizarFecha(fecha) {
    if (!fecha) return '';
    return String(fecha).substring(0, 10);
}

function normalizarHora(hora) {
    if (!hora) return '';
    return String(hora).substring(0, 5);
}

function cancelarEdicionCita() {
    idCitaEditando = null;
    $('btnGuardarCita').textContent = 'Confirmar cita';
    $('btnCancelarEdicionCita').classList.add('hidden');
}

async function eliminarCita(idCita, telefono) {
    if (!confirm('¿Deseas cancelar esta cita?')) return;

    try {
        const res = await fetch(`${API_URL}/citas?idCita=${idCita}`, { method: 'DELETE' });
        const data = await res.json();

        if (!res.ok) {
            mostrarToast(data.error || 'No se pudo cancelar la cita.', 'error');
            return;
        }

        mostrarToast('Cita cancelada correctamente.');
        $('buscarTelefono').value = telefono;
        await consultarMisCitas();
    } catch (error) {
        console.error(error);
        mostrarToast('No se pudo conectar con el servidor.', 'error');
    }
}

function establecerFechaMinima() {
    const hoy = new Date();
    const fecha = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
        .toISOString().split('T')[0];
    $('fechaCita').min = fecha;
}

cargarNegociosPublicos();
establecerFechaMinima();
verificarAccesoAdmin();

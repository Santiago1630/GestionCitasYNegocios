GESTORCITAS - VERSION ORGANIZADA

1. Instalar dependencias:
   npm install

2. Verificar SQL Server:
   - Servidor: 127.0.0.1
   - Puerto: 1433
   - Base de datos: gestorcitas
   - Usuario: sa
   - Contraseña: postgres

3. Ejecutar:
   npm start

4. Abrir:
   http://localhost:8080

CAMBIOS PRINCIPALES
- Frontend separado en index.html, css/estilos.css y js/app.js.
- Diseño propio con CSS, manteniendo una interfaz responsive.
- Se conserva la funcionalidad de citas, login, registro y CRUD de negocios.
- El idUsuario del administrador se guarda en sessionStorage.
- Crear, actualizar y eliminar negocios usa idUsuario.
- La consulta de citas por teléfono se realiza directamente en el backend.
- El servidor sirve directamente el frontend.

IMPORTANTE
El archivo database.js conserva el esquema de nombres de tablas y columnas que tenía el proyecto:
usuarios, negocio y citas.

Si tu contraseña de SQL Server no es 'postgres', cambia ese valor en config/database.js.

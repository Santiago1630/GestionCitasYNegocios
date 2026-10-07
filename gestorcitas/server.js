const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const citaRoutes = require('./controllers/CitaController');
const negocioRoutes = require('./controllers/NegocioController');
const usuarioRoutes = require('./controllers/UsuarioController');

app.use('/api', citaRoutes);
app.use('/api', negocioRoutes);
app.use('/api', usuarioRoutes);

app.get('/prueba', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

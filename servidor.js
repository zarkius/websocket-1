const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/socket.html');
});

io.on('connection', (socket) => {
  // Función para emitir el número de clientes conectados
  const emitNumClientes = () => {
    const numClientes = io.engine.clientsCount;
    io.emit('numClientes', { numClientes });
  };

  // Emitir inmediatamente al conectarse un cliente
  emitNumClientes();

  // Enviar la hora actual al cliente cada segundo
  const interval = setInterval(() => {
    socket.emit('horaActual', { hora: new Date().toTimeString() });
  }, 1000);

  // Escuchar el evento 'disconnect' para actualizar el número de clientes
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
    clearInterval(interval);
    emitNumClientes(); // Actualizar el número de clientes al desconectarse uno
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

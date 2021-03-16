//punto de entrada a nuestra app
const express = require("express");
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = 8000;

app.use(session({ secret: 'tupalabrasecreta' }));
app.use(flash());
//anteponer /static a todos nuestros archivos de estilo y js
app.use('/static', express.static('static'))
    // sin anteponer /static v
    //app.use(express.static(_dirname + "/static"));

//para el uso de variables POST en req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

// importar las rutas
app.use(require('./routes/auth'));
app.use(require('./routes/routes'));


//lanzamos nuestra app
//guardamos en varialble server
const server = app.listen(port, function() {
    console.log('Escuchando en el puerto ' + port);
});


// Ahora creamos nuestras funciones de Sockets
const io = require('socket.io')(server);

let contadorBtn = 0;


// cuando me conecte con algún cliente
io.on('connection', function(socket) {

    /* 
        socket.on('generarYo', function(data) {
            const numeroAzar = Math.floor(Math.random() * 800);
            // mandamos respuesta sólo al usuario que generó el mensaje
            console.log(data);
            socket.emit('numero', { numero: numeroAzar });
        });

        enviar mensaje a todos
        socket.on('generarTodos', function(data) {
            const numeroAzar = Math.floor(Math.random() * 800);
            // mandamos respuesta a todos los usuarios
            io.emit('numero', { numero: numeroAzar });
        });

        enviar mensaje al resto
        socket.on('generarResto', function(data) {
            const numeroAzar = Math.floor(Math.random() * 800);
            // mandamos respuesta a todos los usuarios menos al que envió
            socket.broadcast.emit('numero', { numero: numeroAzar });
        });*/

    //escuchar mensaje desde la vista al servidor
    socket.on('boton_contador', function(data) {
        contadorBtn++;
        //enviar desde el servidor a la vista a TODOS
        io.emit('numero', { count: contadorBtn });

    });

    socket.on('boton_reset', function(data) {
        contadorBtn = 0;
        //enviar desde el servidor a la vista a TODOS
        io.emit('numero', { count: contadorBtn });
    });

});
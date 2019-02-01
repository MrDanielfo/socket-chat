const { io } = require('../server');

const { Usuarios } = require('../classes/Usuarios')

const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();


io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        

        if(!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            })
        }


        client.join(data.sala); 

        usuarios.agregarPersona(client.id, data.nombre, data.sala)

        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasBySala(data.sala))
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió`))

        callback(usuarios.getPersonasBySala(data.sala));
        
    });

    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id)


        let mensaje = crearMensaje(persona.nombre, `${data.mensaje}`)

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
        

        callback(mensaje)
    })

    // Evento Desconexión: cuando un usuario sale de la sala de chat

    client.on('disconnect', () => {

        let usuarioDesconectado = usuarios.eliminarPersona(client.id)
        //console.log(usuarioDesconectado)

        client.broadcast.to(usuarioDesconectado.sala).emit('crearMensaje', crearMensaje('Administrador', `${usuarioDesconectado.nombre} salió`))

        client.broadcast.to(usuarioDesconectado.sala).emit('listaPersona', usuarios.getPersonasBySala(usuarioDesconectado.sala))

    })

    // Mensajes privados 
    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);
        
        // Para enviar mensaje a un usuario en partícular, al broadcast se le agrega  to
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })


});
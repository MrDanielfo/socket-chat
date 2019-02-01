const parametros = new URLSearchParams(window.location.search);

const sala = parametros.get('sala');
const nombre = parametros.get('nombre')

//const nombreSala = document.querySelector('#nombreSala');
const lista = document.getElementById('divUsuarios');

const formEnviar = document.getElementById('formEnviar')

const inputMensaje = document.getElementById('enviar')

const btnEnviarMensaje = document.getElementById('btnEnviarMensaje')

const chatBox = document.getElementById('divChatbox')

var divChatbox = $('#divChatbox');

// funciones para renderizar usuarios

function renderizarUsuarios(personas) {

    console.log(personas)
    //nombreSala.innerText = sala

    usuarios = document.querySelectorAll('li');

    usuarios.forEach(usuario => {
        usuario.remove()
    })

    // Se tiene que poner array porque personas no es un arreglo

    Array.from(personas).forEach(persona => { 
        listaUsuarios(persona)
    });

}

function listaUsuarios(persona) {

    //console.log(persona);  
    const row = document.createElement('li')

    row.innerHTML = `
                <a href="javascript:void(0)" data-id="${persona.id}" class="usuario"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre}<small class="text-success">online</small></span></a>
        `;

    lista.appendChild(row)
}

function renderizarMensaje(mensaje, yo) {

    let fecha = new Date(mensaje.fecha);
    let hora = `${fecha.getHours()} : ${fecha.getMinutes()}`;
    let row;
    let classAdmin = 'inverse'
    let image = '2.jpg'
    if(mensaje.nombre == 'Administrador') {
        classAdmin = 'danger';
        image = 'anonymous.png'
    }

    if(yo) {
         row = document.createElement('li')
         row.className = 'animated fadeIn'
        row.innerHTML = `
                    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>
                    <div class="chat-content">
                        <h5>${mensaje.nombre}</h5>
                        <div class="box bg-light-info">${mensaje.mensaje}</div>
                    </div>
                    <div class="chat-time">${hora}</div>
                    `;

    } else {
       
        row = document.createElement('li')
        row.className = 'animated fadeIn reverse'
        row.innerHTML = `
                    <div class="chat-content">
                        <h5>${mensaje.nombre}</h5>
                        <div class="box bg-light-${classAdmin}">${mensaje.mensaje}</div>
                    </div>
                    <div class="chat-img"><img src="assets/images/users/${image}" alt="user" /></div>
                    <div class="chat-time">${hora}</div>
                    `;
    }

    
    chatBox.appendChild(row)
}

function scrollBottom() {
  // selectors
    var newMessage = divChatbox.children('li:last-child');

  // heights
  var clientHeight = divChatbox.prop('clientHeight');
  var scrollTop = divChatbox.prop('scrollTop');
  var scrollHeight = divChatbox.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    divChatbox.scrollTop(scrollHeight);
  }
}

eventListeners()

function eventListeners() {

    lista.addEventListener('click', detectarId)

    formEnviar.addEventListener('submit', enviarMensaje)

}

function detectarId(e) {

    if(e.target.classList.contains('usuario')) {
        const id = e.target.getAttribute('data-id');
        console.log(id)
    } else {
        console.log('no la es')
    }

}

function enviarMensaje(e) {

    e.preventDefault()

    let mensaje = inputMensaje.value
    if(mensaje.length === 0) {
        console.log(mensaje.length)
        btnEnviarMensaje.disabled
    }
    console.log(mensaje)

    socket.emit('crearMensaje', {
     nombre: nombre,
     mensaje: mensaje
 }, function(mensaje) {
     
     inputMensaje.value = ''
     renderizarMensaje(mensaje, true);
     scrollBottom()
 });

    
    
    
}




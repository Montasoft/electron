const {ipcRenderer} = require('electron');

function agregarProducto(evento){
    evento.preventDefault();

    let nombreProducto = document.querySelector('#nombreProducto').value;
    //# para buscar por id de elemento

    if (nombreProducto){
        document.querySelector('#nombreProducto').value = '';
        //enviar dato a la ventana principal
        ipcRenderer.send('producto:agregar', nombreProducto)
    }
}

document.querySelector('#frmAgregarProducto').addEventListener('submit', agregarProducto);


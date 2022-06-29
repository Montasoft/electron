const {clipboard, remote, globalShortcut, ipcRenderer} = require('electron');
const jquery = require('jquery');
const settings = require('electron-settings');

let atajoTeclado = document.querySelector('input');
let btnRestablecer = document.querySelector("button[type='reset']");
let btnGuardarAtajoTeclado = document.querySelector("button[type='submit']");

//trael el focho 
remote.getCurrentWindow().on('show', async function(){
    atajoTeclado.focus();

    atajoTeclado.value = await settings.get('atajoTecladoGlobal');
})

let teclasAtajoTeclado = [];

// capturar las teclas para el atajo de teclado.
document.body.addEventListener('keyup', function(evento){
    if (evento.key === 'Enter'){

    } else if (evento.key === 'Escape'){
        atajoTeclado.value = '';
        remote.getCurrentWindow().close();
    }else {
        atajoTeclado.focus();
        if(teclasAtajoTeclado.indexOf(evento.key)=== -1){ //indexOf devuelve -1 si no se encuetra
            teclasAtajoTeclado.push(evento.key);
        }
        atajoTeclado.value = teclasAtajoTeclado.join('+').replace('Control','CmdOrCtrl').replace('Arrow', '');

        return true;
    }

});

//usando jquery:
jquery(btnRestablecer).on('click', function(){
    atajoTeclado = '';
    teclasAtajoTeclado = [];
    atajoTeclado.focus();
})

//usando javascript puro
btnGuardarAtajoTeclado.addEventListener('click', async function(){
    await settings.set('atajoTecladoGlobal', atajoTeclado.value);

    atajoTeclado.focus();
    remote.getCurrentWindow,close();
    ipcRenderer.send('finalizar-aplicacion');
});
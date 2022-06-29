const {clipboard, remote} = require('electron');
const jquery = require('jquery');
const dexie = require('dixie') //manejo de mini base de datos.
dexie.debug = true
const db  = new dexie('historial');

//let dato = jquery('#dato');
let dato = document.querySelector('input')
let tablaPortaPapeles = document.querySelector('table');
//let tablaPortaPapeles = jquery('#tablaPortaPapeles');
//tablaPortaPapeles.on('click', cambiarDatoSeleccionado);
tablaPortaPapeles.addEventListener('click', cambiarDatoSeleccionado);

remote.getCurrentWindow().on('show', ()=>{
    dato.focus();

});

document.body.addEventListener('keydown', function(evento){

    let filas = Array.from(document.querySelectorAll('tr td:first-child'));
    
    let indice = filas.indexOf(document.activeElement);

    if (evento.key ==='ArrowUp'){
        let siguienteDato = filas[indice-1] || filas[filas.length-1]
        siguienteDato.focus();
    } else if (evento.key === 'ArrowDown'){
        let siguienteDato = filas[indice+1] || filas[0];
        siguienteDato.focus();
    } else if(evento.key === 'Enter'){
        cambiarDatoSeleccionado(evento);
    } else if(evento.key === 'Escape'){
        dato.value = '';
        refrescarVista();
        remote.getCurrentWindow().close();
    }else{
        dato.focus();
        refrescarVista();
    }
});

async function cambiarDatoSeleccionado(evento){
    if (evento.target.id){
        if (clipboard.readText()=== (await db.historial.get(parseInt(evento.target.id))).text){
            return;
        }
        if (evento.target.getName === 'TD'){
            clipboard.writeText((await db.historial.get(parseInt(evento.target.id))).text) ;
        }
        refrescarVista();
    }
}
function refrescarVista(){
    db.historial.count((e)=>{
        dato.value = `Buscar entre ${e} elementos....`;
    });
    return db.historial.limit(50).desc()
        .filter((h) =>{
            return !dato.value  || h.text.toLowerCase().indexOf(dato.value.toLowerCase()) !== -1;
        })
        .toArray()    
        .Then ((h)=>{
            jquery(tablaPortaPapeles).remove();
            
        });
}
const baseDatos = require('./js/base-datos');

class GestorPersonas{
    constructor(){
        this.frmNuevoRegistro = document.getElementById('frmNuevoRegistro');
        this.registros =document.getElementById('registros');
        this.nombres =document.getElementById('Nombres');
        this.apellidos =document.getElementById('Apellidos');
        this.correo =document.getElementById('correo');
        this.btnCrearRegistro = document.getElementById('btnCrearRegistro');
        this.btnEliminarRegistro = document.getElementsByName('btnEliminarRegistro');


        this.cargarRegistrosPersona();
        this.agregarEventListeners();
    }

    agregarEventListeners(){
        this.frmNuevoRegistro.addEventListener('submit', this.crearRegistroPersona.bind(this));

        this.registros.addEventListener('click', e => {
            console.log("agregando evento a registros");
         //   this.eliminar(e);
            this.eliminarRegistroPersona(e)

        })   
    }

    crearRegistroPersona(evento){
        console.log(evento)
        evento.preventDefault();
        baseDatos.agregarPersona(this.nombres.value, this.apellidos.value, this.correo.value);

        this.nombres.value = '';
        this.apellidos.value = '';
        this.correo.value = '';

        this.cargarRegistrosPersona();

    }
    generarHtmlRegistroPersona(persona){
        return `<tr>
            <td>${persona.nombres}</td>
            <td>${persona.apellidos}</td>
            <td>${persona.correo}</td>
            <td><input type="button" class= "btn btn-danger btn-sm btnEliminar" data-id="${persona._id}" id= "btnEliminarRegistro"  value="Eliminar"></td>
        </tr>`
    }
    cargarRegistrosPersona(){
        baseDatos.obtenerPersonas((personas)=>{
            let html = personas.map(this.generarHtmlRegistroPersona).join('');
            
            this.registros.innerHTML = html
        });
    }

    eliminarRegistroPersona = e =>{
        console.log("llegnado a Eliminar")
        console.log(e.target.classList.contains('btnEliminar'))
        if (e.target.classList.contains('btnEliminar')){
            
            let objeto = e.target.parentElement
            console.log(objeto)
            
            let id = objeto.querySelector('.btnEliminar').dataset.id;
            console.log(objeto.querySelector('.btnEliminar').dataset.id)
            baseDatos.eliminarPersona(id);
            this.cargarRegistrosPersona();

        }
        e.stopPropagation() //detener cualquie otro evento que se pueda generar
    }

}

let gestorPersonas = new GestorPersonas();



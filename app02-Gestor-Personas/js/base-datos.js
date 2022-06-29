var Datastore = require('nedb');

let db = new Datastore({filename: 'db/personas.bd', autoload: true});

exports.agregarPersona = function(nombres, apellidos, correo){
    var persona = {
        nombres: nombres,
        apellidos: apellidos,
        correo: correo
    };
    db.insert(persona,function(error, nuevoObjeto){

    });
};
exports.obtenerPersonas = function(operacion){
    db.find({}, function(error, personas){
        // recuperar todos los registros
        if(personas){
            operacion(personas);
        }
    });
};

exports.eliminarPersona = function(id){
    db.remove({_id: id}, {}, function (error, numeroRegistrosEliminados){
        console.log("registro eliminado")

    });
};
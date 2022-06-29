
const {app, BrowserWindow} = require('electron');
const path = require('path');
const remoteMain = require('@electron/remote/main');
remoteMain.initialize();


const crearVentanaPrincipal = () => {
    let ventanaPrincipal = new BrowserWindow({
        width: 700,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            //enableRemoteModule: true, 
            // contextIsolation: false soluciona el problema de "Uncaught ReferenceError: require is not defined" que se me presentaba en app.js linea 1
            //la siguiente linea está recomendada en la misma pagina pero no comprobada por mi.
            enableRemoteModule: true
        }
    
    });
    remoteMain.enable(ventanaPrincipal.webContents)
    ventanaPrincipal.loadFile(path.join(__dirname, 'index.html'));

}; 

app.whenReady().then(crearVentanaPrincipal);
//cuando este todo listo crear la ventana principal

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        //platafora mac se cierra automáticamente.
        app.quit();
    }
});

app.on('activate', () => {
    if (ventanaPrincipal === null){
        crearVentanaPrincipal();
    }
});
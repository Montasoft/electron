const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

let ventanaPrincipal = null;

app.once('ready', ()=>{
    ventanaPrincipal = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        resizable: false,
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false 
        }
    });
    ventanaPrincipal.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));
    ventanaPrincipal.once('ready-to-show', ()=>{
        ventanaPrincipal.show();
    })
    ventanaPrincipal.setMenu(null);
});



app.on('window-all-closed',()=>{
    if (process.platform !== 'darwin'){
        app.quit();

    }
})

app.on('activate', () => {
    if (ventanaPrincipal === null){
        crearVentanaPrincipal();
    }
});

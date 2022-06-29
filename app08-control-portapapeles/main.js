const {app, BrowserWindow, clipboard, globalShortcut, ipcMain, Menu, Tray} = require('electron');
const path = require('path');
const settings = require('electron-settings');
const { platform } = require('os');

if (!app.requestSingleInstanceLock()) {
    //si se está ejecutando otra instancia de la aplicación
    app.quit();

}

async function iniciarAplicacion(){
    const ventanaPrincipal = new BrowserWindow({
        width: 400,
        height: 650,
        frame: false, //si tiene barra de titulo
        resizable: false, //si permite redimensionar
        maximizable: false, //si permite maximisar
        show: false, //quedar oculta al inicar
        title: 'Clip de portapapeles',
        webPreferences:{
            preload: path.join(__dirname, 'js', 'preload.js'),
            //directorio de la aplicación, carpeta, archivo
            nodeIntegration: true
        }

    });
    ventanaPrincipal.setMenuBarVisibility(false);
    ventanaPrincipal.loadFile('index.html');

    const atajoTecladoVentana = new BrowserWindow({
        width: 400,
        height: 650,
        frame: false, //si tiene barra de titulo
        resizable: false, //si permite redimensionar
        maximizable: false, //si permite maximisar
        show: false, //quedar oculta al inicar
        title: 'atajo Teclado',
        webPreferences:{
            nodeIntegration: true
        }
    });
    atajoTecladoVentana.setMenuBarVisibility(false);
    atajoTecladoVentana.loadFile('atajoTeclado.html');

    atajoTecladoVentana.on('close', (evento)=>{
        //si no es el intento de cierre de esa ventana
        if (!app.isQuiting){
            // evita la acción por defecto
            evento.preventDefault();
            //oculta la ventana
            atajoTecladoVentana.hide();

        }
        return false;
    });

    ventanaPrincipal.on('minimize', (evento)=>{
        evento.preventDefault();
        ventanaPrincipal.hide();

    })
    ventanaPrincipal.on('close', (evento)=>{
        //si no es el intento de cierre de esa ventana
        if (!app.isQuiting){
            // evita la acción por defecto
            evento.preventDefault();
            //oculta la ventana
            atajoTecladoVentana.hide();
        }
    });

    const iconos = {
        darwin: 'images/16x16.png',
        linux: 'images/64x64.png',
        win32: 'images/64x64.png'
    }

    let areaBandeja = new Tray(path.join(__dirname, iconos[process.platform])); //directorio app, carpeta
    //obtiene la key del objeto de acuerdo a la plataforma.

    areaBandeja.setToolTip('Mostrar el historial del portapapeles');

    const plantillaOperaciones = [
        {
            label: 'Mostrar historial',
            click: ()=> ventanaPrincipal.show()
        },
        {
            label: 'Cambiar atajo de teclado',
            click: ()=> atajoTecladoVentana.show()
        },
        {
            type: 'separator'
        },
        {
            label: 'Salir',
            click: ()=> app.exit()
        }
    ]
    
    let menuContextual = Menu.buildFromTemplate(plantillaOperaciones);
    areaBandeja.setContextMenu(menuContextual);

    let atajoTecladoGlobal = await settings.get('atajoTecladoGlobal');
    if (!atajoTecladoGlobal){
        await settings.set('atajoTecladoGlobal', 'CmdOrCtrl+Alt+Shift+Up');
        atajoTecladoGlobal= 'CmdOrCtrl+Alt+Shift+Up';
        
    }
    globalShortcut.register(atajoTecladoGlobal, ()=>{
    areaBandeja.focus();
    ventanaPrincipal.show();
    });
}

function alternarTeclado(){
    let seleccionContenido = clipboard.readText('selection');

    clipboard.writeText('JavaScript', 'selection');

    seleccionContenido = clipboard.readText('selection');
    
}

app.whenReady().then(iniciarAplicacion);


app.on('window-all-closed', ()=>{
    if (process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate', ()=>{
    if (BrowserWindow.getAllWindows().length === 0){
        iniciarAplicacion();
    }
});

ipcMain.on('finalizar-aplicacion', ()=>{
    app.exit();
});

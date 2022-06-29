const {app, BrowserWindow, Menu} = require('electron')

let ventanaPrincipal;

let menuAplicacionPlantilla=[
    {
        label: 'Aplicación',
        submenu:[
            {
                label: 'Acerca de',
                click: ()=>{
                    abrirVentanaAcercaDe();
                }
            },
            {
                label: "Toggle Dev Tools",
                accelerator: "F12",
                click: ()=>{
                    ventanaPrincipal.webContents.toggleDevTools();
                }
            }
        ]
    }
];

function crearVentanaprincipal(){
    ventanaPrincipal = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false 
            // contextIsolation: false soluciona el problema de "Uncaught ReferenceError: require is not defined" que se me presentaba en app.js linea 1
            //la siguiente linea está recomendada en la misma pagina pero no comprobada por mi.
            //enableRemoteModule: true
        }
    });
    ventanaPrincipal.loadFile('index.html')

    let menu = Menu.buildFromTemplate(menuAplicacionPlantilla);
    ventanaPrincipal.setMenu(menu);

    ventanaPrincipal.on('closed', ()=>{
        ventanaPrincipal=null;
    });
}

function abrirVentanaAcercaDe(){
    let ventanaAcercaDe = new BrowserWindow({
        parent: ventanaPrincipal,
        modal: true,
        show: false,
        width: 400,
        height:250
    });
    ventanaAcercaDe.loadFile('acerca-de.html');
    ventanaAcercaDe.setMenu(null);
    ventanaAcercaDe.once('ready-to-show', () =>   {
        ventanaAcercaDe.show();
    });
}

app.whenReady().then(crearVentanaprincipal);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin'){
        //platafora mac se cierra automáticamente.
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0){
        crearVentanaPrincipal();
    }
});
const {app, BrowserWindow, Menu, ipcMain} = require ('electron');

let ventanaPrincipal;
let ventanaNuevoProducto;

let menuPrincipalPlantilla=[
    {
        label: 'Archivo',
        submenu:[
            {
                label: 'Agregar Producto',
                click: ()=>{
                    crearVentanaAgregarProducto();
                }
            },
            {
                label: 'Eliminar Producto',
                click: ()=>{
                    ventanaPrincipal.webContents.send('productos:eliminar')
                }
            },
            {
                label: 'Salir',
                accelerator: process.platform === 'darwin' ? 'Command+Q': 'Ctrl+Q',
                click: ()=>{
                    app.quit();
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
    ventanaPrincipal.loadFile('index.html');
 
    let menuPrincipal = Menu.buildFromTemplate(menuPrincipalPlantilla);
    ventanaPrincipal.setMenu(null)

}

function crearVentanaAgregarProducto(){
    ventanaNuevoProducto = new BrowserWindow({
        parent: ventanaPrincipal,
        modal: true,
        width: 300,
        height: 200,
        title: 'Agregar Producto',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false 
            // contextIsolation: false soluciona el problema de "Uncaught ReferenceError: require is not defined" que se me presentaba en app.js linea 1
            //la siguiente linea está recomendada en la misma pagina pero no comprobada por mi.
            //enableRemoteModule: true
        }
    });

    ventanaNuevoProducto.loadFile('agregarProducto.html')
    ventanaNuevoProducto.Menu('')

    ventanaNuevoProducto.on('close', function(){
        ventanaNuevoProducto = null;
    })
}
app.whenReady().then(crearVentanaprincipal);

ipcMain.on('producto:agregar', function(evento, nombreProducto){
    ventanaPrincipal.webContents.send('producto:agregar', nombreProducto);
})
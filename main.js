const {app, BrowserWindow, Menu} = require('electron');


let win = null;
const DEBUG = false;

function createWindow() {
    // Initialize the window to our specified dimensions
    win = new BrowserWindow({
        width: 1200,
        height: 800,
    });
    // Specify entry point
    win.loadURL('http://localhost:3000');


    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    // Show dev tools
    if (DEBUG === true) {
        win.webContents.openDevTools();
    }

    // Remove window once app is closed
    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', () => {
    createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});


// NOTE: Working on the file menu right now
// create menu template
const mainMenuTemplate = [
    {label: 'File',
        submenu: [{label: 'New Project'},
            {label: 'Open Project',
            // could not fix the lint error in these lines withour breaking the code
                /*eslint-disable */
                accelerator: process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O',
                click() { var properties = ['multiSelections', 'createDirectory', 'openFile'],
                    parentWindow = (process.platform === 'darwin') ? null : BrowserWindow.getFocusedWindow();}
                    /* eslint-enable */
            },

            {type: 'separator'},
            {label: 'Save json'},
            {label: 'Load json'},
            {type: 'separator'},
            {label: 'Save stl'},
            {label: 'Save pdf'},
            {type: 'separator'},
            {label: 'Exit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                },
            }]}, // submenu
    {label: 'Edit',
        submenu: [{role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}]}, // submenu
    {role: 'help',
        submenu: [{label: 'Learn More', click() {
            require('electron').shell.openExternal('https://github.com/cyrillegin/seniorProject');
        }}]},
];

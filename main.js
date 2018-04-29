const url = require('url');
const path = require('path');
const exec = require('child_process').exec;
const {app, BrowserWindow, Menu} = require('electron');

let win = null;
let check = null;


child = exec('nodemon --ignore /client/ --exec babel-node src/server',
    (error, stdout, stderr) => {
        console.log(`stdout: ${ stdout}`);
        console.log(`stderr: ${ stderr}`);
        if (error !== null) {
            console.log(`exec error: ${ error}`);
        }
    });


function createWindow() {
    // Initialize the window to our specified dimensions
    win = new BrowserWindow({
        width: 1200,
        height: 800,
    });


    // Specify entry point
    win.loadURL('http://localhost:3000');

    /* win.loadURL(url.format({
        pathname: path.join(__dirname, 'electron.html'),
        protocol: 'file:',
        slashes: true,
    })); */

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);


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
        submenu: [{label: 'New Project', click() {
            check = new BrowserWindow({
                width: 500,
                height: 100,
            });

            check.loadURL(url.format({
                pathname: path.join(__dirname, 'saveCheck.html'),
                protocol: 'file:',
                slashes: true,
            }));

            check.setMenu(null);

            check.show();
        }},


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


    {label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'},
        ]},

    {role: 'help',
        submenu: [{label: 'Learn More', click() {
            require('electron').shell.openExternal('https://github.com/cyrillegin/seniorProject');
        }}]},
];

// build menu from template
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenu);

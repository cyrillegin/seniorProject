const exec = require('child_process').exec;
const {app, BrowserWindow, Menu} = require('electron');

let win = null;

child = exec('nodemon --ignore /client/ --exec babel-node src/server ',
    (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });


function createWindow() {

    // Initialize the window to our specified dimensions
    if (process.platform === 'darwin') {
        win = new BrowserWindow({
            width: 1450,
            height: 900,
            icon: './assests/icon/mac/icon.icns',
        });
    }

    if (process.platform === 'win32') {
        win = new BrowserWindow({
            width: 1200,
            height: 800,
            icon: './assests/icon/windows/icon.ico',
        });
    }

    if (process.platform === 'linux') {
        win = new BrowserWindow({
            width: 1200,
            height: 800,
            icon: './assests/icon/linux/icon.png',
        });

    }

    // Specify entry point
    win.loadURL('http://localhost:3000');

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
const mainMenuTemplate = [{
    label: 'File',
    submenu: [{
        label: 'New Project', click() {
            win.reload();
        },
    }, {
        type: 'separator',
    }, {
        label: 'Save json', click() {
            win.webContents.executeJavaScript(`
                console.log('start');
                setTimeout(function() {
                    document.querySelector('#save-json').click()
                });
            `);
        },
    }, {
        label: 'Load json', click() {
            win.webContents.executeJavaScript(`
                setTimeout(function() {
                    document.querySelector('#load-json').click();
                });
            `);
        },
    }, {
        type: 'separator',
    }, {
        label: 'Save stl', click() {
            win.webContents.executeJavaScript(`
                setTimeout(function() {
                    document.querySelector('#save-stl').click();
                });
            `);
        },
    }, {
        label: 'Save obj', click() {
            win.webContents.executeJavaScript(`
                setTimeout(function() {
                    document.querySelector('#save-obj').click();
                });
            `);
        },
    }, {
        type: 'separator',
    }, {
        label: 'Save PNG', click() {
            win.webContents.executeJavaScript(`
                setTimeout(function() {
                    document.querySelector('#save-png').click();
                });
            `);
        },
    },  {
        type: 'separator',
    }, {
        label: 'Exit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q', click() {
            app.quit();
        },
    }],
}, {
    label: 'Edit', submenu: [
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'delete'},
    ],
}, {
    label: 'View', submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'},
    ],
}, {
    role: 'help', submenu: [{
        label: 'Learn More', click() {
            require('electron').shell.openExternal('https://github.com/cyrillegin/seniorProject');
        }}],
}];

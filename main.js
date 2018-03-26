const {app, BrowserWindow, Menu} = require('electron');
//const path = require('path');
//const url = require('url');
const electron = require('electron')

let win = null;


function createWindow() {
  // Initialize the window to our specified dimensions
  win = new BrowserWindow({width: 1000, height: 600});
  // Specify entry point
  win.loadURL('http://localhost:3000');
  

  //build menu from template
  /*const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);*/

// Show dev tools
  win.webContents.openDevTools();
  // Remove window once app is closed
  win.on('closed', function () {
    win = null;
  });
}

app.on('ready', function () {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});
/*app.on('ready', function (){
    //Create browser window
    win = new BrowserWindow({width:800, height:600, icon:__dirname+'/img/Boat1.png'});

    win.loadURL('http://localhost:4200');
    //Load index.html
    win.loadURL(url.format({
      pathname: path.join(__dirname,'index.html'),
      //pass path of current directory to loadURL
      protocol: 'file',
      slashes: true
    }));

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
      Menu.setApplicationMenu(mainMenu);

});*/


//create menu template
/*const mainMenuTemplate = [
  {  label: 'File',
     submenu:[{label: 'New Project'},
              {label: 'Open Project',
              accelerator:  process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
              click: function() { var properties = ['multiSelections', 'createDirectory', 'openFile'],
                 parentWindow = (process.platform == 'darwin') ? null : BrowserWindow.getFocusedWindow();}},

              {type: 'separator'},
              {label: 'Save'},
              {label: 'Save As'},

              {type: 'separator'},
              {label: 'Exit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){ app.quit()}
              }]//submenu
  },
  { label: 'Edit',
    submenu:[{role: 'undo'},
             {role: 'redo'},
             {type: 'separator'},
             {role: 'cut'},
             {role: 'copy'},
             {role: 'paste'},
             {role: 'pasteandmatchstyle'},
             {role: 'delete'},
             {role: 'selectall'}]//submenu

  },
  {role: 'help',
   submenu: [{label: 'Learn More',
             click () { require('electron').shell.openExternal('https://electronjs.org') }
             }]
  }

];*/

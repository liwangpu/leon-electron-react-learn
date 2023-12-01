/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, protocol, net } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { MESSAGE_CHANNEL } from '../consts';
import { handleMessage } from './messages';
import { MessageTopic } from '../enums';

// console.log(`__dirname:`,__dirname);

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// ipcMain.on(MESSAGE_CHANNEL, async (event, arg) => {
//   // event.reply('ipc-example', msgTemplate('pong'));
//   await handleMessage({ event, message: arg, mainWindow: mainWindow! });
//   // event.reply(MESSAGE_CHANNEL, res);
// });

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 600,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js')
    }
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

const createTKWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadURL('https://www.tiktok.com');
  // mainWindow.webContents.enableDeviceEmulation({ screenPosition: 'mobile', screenSize: { width: 800, height: 680 },viewSize: });
  // mainWindow.webContents.setUserAgent("Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27");
  // mainWindow.webContents.openDevTools();
};

const createDevAppWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.loadURL('http://localhost:4201');
  // mainWindow.webContents.enableDeviceEmulation({ screenPosition: 'mobile', screenSize: { width: 800, height: 680 },viewSize: });
  // mainWindow.webContents.setUserAgent("Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27");
  // mainWindow.webContents.openDevTools();
};

const createMainWindow = async () => {
  createWindow();
  // createTKWindow();
  // createDevAppWindow();
};

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// app.commandLine.appendSwitch('lang', 'en-US');
app.commandLine.appendSwitch('lang', 'th-TH');


const detectRequest = () => {
  // const { host, pathname } = new URL(req.url);
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'http',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true
      }
    }
  ]);

  protocol.handle(`app`, async (req) => {
    const { host, pathname } = new URL(req.url);
    // if (host === 'bundle') {
    //   if (pathname === '/') {
    //     return new Response('<h1>hello, world</h1>', {
    //       headers: { 'content-type': 'text/html' }
    //     });
    //   }
    //   // NB, this does not check for paths that escape the bundle, e.g.
    //   // app://bundle/../../secret_file.txt
    //   return net.fetch(pathToFileURL(join(__dirname, pathname)).toString());
    // } else if (host === 'api') {
    console.log(`detect url:`, pathname);

    const res = await net.fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    // console.log(`res:`, res);
    return res;
    // }
  });
};


const listenMessage = () => {
  const topics = Object.keys(MessageTopic);

  for (const topic of topics) {
    ipcMain.on(topic, async (event, arg) => {
      handleMessage({ mainWindow: mainWindow!, event, topic, data: arg });
    });
  }
};

app
  .whenReady()
  .then(() => {
    createMainWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createMainWindow();
    });

    // detectRequest();

    // let time = 1;
    // const hd = setInterval(() => {
    //   if (time >= 4) {
    //     clearInterval(hd);
    //     return;
    //   }
    //   console.log(`send info:`,time);
    //   mainWindow?.webContents.send('test-info',time);
    //   time++;
    // }, 1000);

    listenMessage();

  })
  .catch(console.log);

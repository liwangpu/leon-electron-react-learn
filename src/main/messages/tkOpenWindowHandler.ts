import { getTKPartitionKey, IMessageHandler, IMessageHandlerContext, IMessageParam } from './index';
import { BrowserWindow, Menu, session } from 'electron';
import { getExternalPreload, windowManager } from '../commons';
import { getExternalScript } from '../externalScripts';

const HOME_URL = `https://www.tiktok.com/`;

// const HOME_URL=`http://127.0.0.1:5500/`;

export class TkOpenWindowHandler implements IMessageHandler {

  constructor(protected context: IMessageHandlerContext) {
  }

  handle({ event, data }: IMessageParam & { data: { account: string } }): any {
    const windowKey = getTKPartitionKey(data.account);
    console.log(`windowKey:`, windowKey);
    if (windowManager.getWindow(windowKey)) {
      // const w = windowManager.getWindow(windowKey);
      // w!.focus();
      return;
    }

    const currentSession = session.fromPartition(windowKey);
    const childWin = new BrowserWindow({
      width: 1024,
      height: 780,
      title: data.account,
      // parent: this.context.mainWindow,
      webPreferences: {
        session: currentSession,
        preload: getExternalPreload('tiktokPreload.js')
      }
    });

    TkOpenWindowHandler.createMenu(childWin);

    windowManager.setWindow(windowKey, childWin);

    childWin.loadURL(HOME_URL);

    childWin.on('page-title-updated', function(e) {
      e.preventDefault();
    });

    childWin.once('ready-to-show', () => {
      childWin.show();
      // childWin.setTitle(data.account);
      // childWin.webContents.openDevTools();
    });

    // Once dom-ready
    childWin.webContents.once('dom-ready', () => {
      childWin.webContents.executeJavaScript(getExternalScript('tiktok.js'));
    });

    childWin.once('closed', () => {
      windowManager.removeWindow(windowKey);
    });

  }

  private static createMenu(win: BrowserWindow) {
    const template = [
      {
        label: '开发调试',
        submenu: [
          {
            label: '刷新',
            accelerator: 'Ctrl+W',
            click: () => {
              // this.mainWindow.close();
              win.webContents.reload();
            }
          }
        ]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    win.setMenu(menu);
  }

}

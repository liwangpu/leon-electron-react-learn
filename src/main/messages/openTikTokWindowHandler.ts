import { IMessageHandler, IMessageHandlerContext, IMessageParam } from './index';
import { BrowserWindow, session } from 'electron';
import { getExternalPreload, windowManager } from '../commons';

export class OpenTikTokWindowHandler implements IMessageHandler {

  constructor(protected context: IMessageHandlerContext) {
  }

  handle({ event, data }: IMessageParam & { data: { account: string } }): any {
    const windowKey = `persist:tiktok@${data.account}`;
    if (windowManager.getWindow(windowKey)) {
      const w = windowManager.getWindow(windowKey);
      w!.focus();
      return;
    }

    const currentSession = session.fromPartition(windowKey);
    const child = new BrowserWindow({
      width: 1024,
      height: 780,

      parent: this.context.mainWindow,
      webPreferences: {
        session: currentSession,
        // partition: `persist:${modalIndex}`,
        // preload: getExternalPreload('tiktokPreload.js'),
        preload: getExternalPreload('tiktokPreload.js'),
        devTools: true,
      }
    });
    windowManager.setWindow(windowKey, child);
    child.loadURL('http://127.0.0.1:5500/');
    // child.loadURL('https://www.tiktok.com/');

    // ses.webRequest.onCompleted({
    //   urls: [`http://1.116.37.43:9901/*`]
    // }, () => {
    // console.log(`onCompleted`);
    // });

    child.once('ready-to-show', () => {
      child.show();
      child.webContents.openDevTools();
      // child.webContents.ex
    });

    child.once('closed', () => {
      windowManager.removeWindow(windowKey);
    });


  }

}

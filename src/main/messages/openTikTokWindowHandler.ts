import { IMessageHandler, IMessageHandlerContext, IMessageParam, MessageHandlerConstructor } from './index';
import { MESSAGE_CHANNEL } from '../../consts';
import { BrowserWindow, BrowserView, session } from 'electron';
import { faker } from '@faker-js/faker';

let modalIndex = 1;

export class OpenTikTokWindowHandler implements IMessageHandler {

  constructor(protected context: IMessageHandlerContext) {
  }

  handle({ event }: IMessageParam): any {

    const ses = session.fromPartition(`persist:${modalIndex}`);
    const child = new BrowserWindow({
      parent: this.context.mainWindow,
      webPreferences: {
        session: ses
        // partition: `persist:${modalIndex}`,
      }
    });
    child.loadURL('http://127.0.0.1:9001');

    ses.webRequest.onCompleted({
      urls: [`http://1.116.37.43:9901/*`]
    }, () => {
    console.log(`onCompleted`);
    });



    child.once('ready-to-show', () => {

      child.show();


    });


    modalIndex++;

    // let view = new BrowserView({
    //   webPreferences: {
    //     nodeIntegration: false
    //   }
    // });
    // this.context.mainWindow.setBrowserView(view);
    // view.setBounds({ x: 0, y: 0, width: 300, height: 300 });
    // view.webContents.loadURL('http://127.0.0.1:5500');

  }

}

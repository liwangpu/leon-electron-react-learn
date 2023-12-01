import { IMessage } from '../../interfaces';
import { MessageTopic } from '../../enums';
import { OpenHtmlFileHandler } from './openHtmlFileHandler';
import { OpenTikTokWindowHandler } from './openTikTokWindowHandler';
import { BrowserWindow } from 'electron';

export interface IMessageParam {
  event: any;
  topic: MessageTopic | string;
  data?: any;
}

export interface IMessageHandlerContext {
  mainWindow: BrowserWindow;
}

export interface IMessageHandler {
  handle(params: IMessageParam): Promise<any> | any;
}

export interface MessageHandlerConstructor {
  new(context: IMessageHandlerContext): IMessageHandler;
}


function getActionHandler(topic: MessageTopic): MessageHandlerConstructor | null {
  switch (topic) {
    case MessageTopic.openHtmlFile:
      return OpenHtmlFileHandler;
    case MessageTopic.openTiktokWindow:
      return OpenTikTokWindowHandler;
    default:
      return null;
  }
}

export async function handleMessage(params: IMessageParam & IMessageHandlerContext) {
  const { mainWindow, event, topic, data } = params;
  const Handler = getActionHandler(topic as any);
  if (Handler) {
    const handler = new Handler({ mainWindow });
    return handler.handle({ event, topic, data });
  }

}


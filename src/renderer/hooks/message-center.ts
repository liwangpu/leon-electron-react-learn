import { IMessage } from '../../interfaces';
import { MessageTopic } from '../../enums';

export function useMessageCenter() {
  // return (message: IMessage) => {
  //   window.electron.ipcRenderer.sendMessage(MessageTopic.openTiktokWindow, message);
  // };

  return {
    openTiktokWindow(){
      window.electron.ipcRenderer.sendMessage(MessageTopic.openTiktokWindow);
    },
  };
}

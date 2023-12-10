import { MessageTopic } from '../../enums';

export function useMessageCenter() {

  const sendMessage = (params: { topic: MessageTopic, data?: any }) => {
    if (!window.electron) {
      console.log(`当前不在Electron App中,故该消息将不会发送:`, params);
      return;
    }
    window.electron.ipcRenderer.sendMessage(params.topic, params.data);
  };

  return {
    openTiktokWindow(params: { account: string }) {
      sendMessage({ topic: MessageTopic.tkOpenWindow, data: params });
    },
    gotoLogin(params: { account: string, password: string }) {
      sendMessage({ topic: MessageTopic.tkGotoLogin, data: params });
    }
  };
}

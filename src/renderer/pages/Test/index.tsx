import { Button } from 'antd';
import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { useMessageCenter } from '../../hooks';
import { MessageTopic } from '../../../enums';

const TestPage: React.FC = observer(props => {

  const message = useMessageCenter();

  const handleOpenTiktok = () => {
    // send({
    //   topic: MessageTopic.openTiktokWindow
    // });

    message.openTiktokWindow();
  };

  const handleLogin = () => {

  };

  return (
    <div className={styles['page']}>

      <div className={styles['page__header']}>
        <Button onClick={handleOpenTiktok}>打开页面</Button>
        <Button onClick={handleLogin}>去登录</Button>
      </div>
    </div>
  );
});

TestPage.displayName = 'TestPage';

export default TestPage;

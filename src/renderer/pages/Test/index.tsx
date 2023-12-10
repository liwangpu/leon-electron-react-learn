import { Button, Collapse } from 'antd';
import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { toJS, values } from 'mobx';
import { useMessageCenter } from '../../hooks';
import { tkStore } from '../../stores';

const store = tkStore.initialize();

// store.addAccount({ account: 'leon-th1.pu@outlook.com', password: 'Leon.pu199139!' });
// store.addAccount({ account: 'leon-th2.pu@outlook.com', password: 'Leon.pu199139!' });


const TestPage: React.FC = observer(props => {

  const message = useMessageCenter();

  const handleOpenTiktok = (ac: tkStore.AccountModel) => {
    message.openTiktokWindow(toJS(ac));
  };

  const handleLogin = (ac: tkStore.AccountModel) => {
    message.gotoLogin(toJS(ac));
  };

  const renderTKButtons = (ac: tkStore.AccountModel) => {
    return (
      <div className={styles['collapse-content']}>
        <Button onClick={() => handleOpenTiktok(ac)}>打开</Button>
        <Button onClick={() => handleLogin(ac)}>去登录</Button>
      </div>
    );
  };

  const items = values<tkStore.AccountModel>(store.accounts as any).map(ac => ({
    key: ac.account,
    label: ac.account,
    children: renderTKButtons(ac)
  }));

  return (
    <div className={styles['page']}>

      <div className={styles['page__header']}>

      </div>

      <Collapse
        items={items}
        defaultActiveKey={values<tkStore.AccountModel>(store.accounts as any).map(ac => ac.account)}
      />
    </div>
  );
});

TestPage.displayName = 'TestPage';

export default TestPage;

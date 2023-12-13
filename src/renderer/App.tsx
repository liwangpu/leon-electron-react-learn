import { ExperimentFilled, ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { AppSidebar, IMenu } from 'leon-rc-toolkit';
import styles from './app.module.scss';
import { tkStore } from './stores';
import { useEffect } from 'react';
import { addMiddleware } from 'mobx-state-tree';

const tkStoreInstance = tkStore.initialize();

const routes: Array<IMenu> = [
  {
    title: '账号管理',
    url: '/app/account-manager',
    icon: (<TeamOutlined />)
    // activedIcon: (<ExperimentFilled />)
  },
  {
    title: '测试',
    url: '/app/test',
    icon: (<ExperimentOutlined />),
    activedIcon: (<ExperimentFilled />)
  }
];

const App = () => {

  useEffect(() => {

    addMiddleware(tkStoreInstance, (call, next, abort) => {
      // console.log(`call:`,call);

      next(call);
    });
    return () => {

    };
  }, []);

  return (
    <div className={styles['app']}>
      <div className={styles['app__navigation']}>
        <AppSidebar menus={routes} />
      </div>
      <div className={styles['app__page']}>
        <Outlet />
      </div>
    </div>
  );
};

export default App;

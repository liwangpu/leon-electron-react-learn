import {
  ApiFilled,
  ApiOutlined,
  AppstoreFilled,
  AppstoreOutlined,
  CodepenOutlined,
  CodeSandboxSquareFilled,
  ExperimentFilled,
  ExperimentOutlined,
  FireFilled,
  FireOutlined,
  FormatPainterFilled,
  FormatPainterOutlined
} from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { AppSidebar, IMenu } from 'leon-rc-toolkit';
import styles from './app.module.scss';

const routes: Array<IMenu> = [
  {
    title: '测试',
    url: '/app/test',
    icon: (<ExperimentOutlined />),
    activedIcon: (<ExperimentFilled />)
  }
];

const App = () => {
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

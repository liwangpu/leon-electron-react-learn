import { Button, Collapse, Drawer, Form, Input, Space, Table } from 'antd';
import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { toJS, values } from 'mobx';
import { useMessageCenter } from '../../hooks';
import { tkStore } from '../../stores';
import Page from '../../components/Page';
import { useMemo, useState } from 'react';
import { ClearOutlined, PlusOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import EditPanel from './EditPanel';
import { Await } from 'react-router-dom';

const store = tkStore.initialize();

store.addAccount({ account: 'leon-hk1.pu@outlook.com', password: 'Leon.pu199139!' });
store.addAccount({ account: 'leon-hk2.pu@outlook.com', password: 'Leon.pu199139!' });

const AccountManager: React.FC = observer(() => {

  const [form] = Form.useForm();
  const [editPanelForm] = Form.useForm();
  const [drawerOpened, setDrawerOpened] = useState(true);

  const columns = useMemo(() => {
    return [
      {
        title: '账号',
        dataIndex: 'account',
        key: 'account'
      },
      {
        title: '国家',
        dataIndex: 'country',
        key: 'country'
      }
    ];
  }, []);

  const handleAddAccount = () => {
    editPanelForm.resetFields();
    showDrawer();
  };

  const handleEditAccount = (ac: tkStore.AccountModel) => {
    editPanelForm.resetFields();
    const value = toJS(ac);
    editPanelForm.setFieldsValue(value);
    showDrawer();
  };

  const handleSaveAccount = async () => {
    try {
      const data = await editPanelForm.validateFields();
      // console.log(`res:`, res);
      store.addAccount(data);
    } catch (errors) {
      console.log(`errors:`, errors);
    }


  };

  const showDrawer = () => {
    setDrawerOpened(true);
  };

  const onClose = () => {
    setDrawerOpened(false);
  };

  return (
    <Page
      header={(
        <div>
          <Form
            layout='inline'
            form={form}
            // size='small'
          >
            <Form.Item label='账号'>
              <Input placeholder='请输入账号' />
            </Form.Item>
            <Form.Item label='国家'>
              <Input placeholder='请输入国家' />
            </Form.Item>
            <Form.Item>
              <div className={styles['header-button-container']}>
                <Button type='default' icon={<SearchOutlined />}>搜索</Button>
                <Button danger icon={<ClearOutlined />}>重置</Button>
                <Button type='primary' icon={<PlusOutlined />} onClick={handleAddAccount}>添加</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      )}
    >
      <div className={styles['table-container']}>
        <Table
          dataSource={values(store.accounts) as any}
          columns={columns}
          pagination={false}
          rowSelection={{
            type: 'checkbox'
          }}
          onRow={(record) => {
            return {
              onClick: (event) => {
                handleEditAccount(record as any);
              }
            };
          }}
        />

        <Drawer
          title='编辑账号'
          placement='right'
          width={600}
          onClose={onClose}
          open={drawerOpened}
          extra={
            <Space>
              <Button type='primary' icon={<SaveOutlined />} onClick={handleSaveAccount}>保存</Button>
            </Space>
          }
        >
          <EditPanel form={editPanelForm} />
        </Drawer>
      </div>
    </Page>
  );
});

AccountManager.displayName = 'AccountManager';

export default AccountManager;

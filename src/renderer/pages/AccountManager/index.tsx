import { Button, Drawer, Form, Input, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { toJS, values } from 'mobx';
import { tkStore } from '../../stores';
import Page from '../../components/Page';
import { useEffect, useMemo, useState } from 'react';
import { ClearOutlined, PlusOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import EditPanel from './EditPanel';
import VMOperator from './VMOperator';

const store = tkStore.initialize();

const AccountManager: React.FC = observer(() => {

  const [form] = Form.useForm();
  const [editPanelForm] = Form.useForm();
  const [editPanelOpened, setEditPanelOpened] = useState(false);
  const currentId = Form.useWatch('id', editPanelForm);
  const currentAccount = store.getAccount(currentId);

  useEffect(() => {
    store.queryAccounts();
  }, []);

  const columns = useMemo<ColumnsType>(() => {
    return [
      {
        title: '账号',
        dataIndex: 'account',
        key: 'account',
        render: (value: any, record: tkStore.AccountModel) => {
          return (
            <p>
              <span>{value}</span>
              {record.onLine && (<span className={styles['account-online-flag']}></span>)}
            </p>
          );
        }
      },
      {
        title: '语言',
        dataIndex: 'languageDisplayName',
        key: 'languageDisplayName'
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

      if (!data.id) {
        const account = await store.addAccount(data);
        editPanelForm.setFieldsValue({ ...data, id: account.id });
      } else {
        await store.updateAccount(data);
      }

      setEditPanelOpened(false);
    } catch (errors) {
      console.log(`errors:`, errors);
    }

  };

  const showDrawer = () => {
    setEditPanelOpened(true);
  };

  const onClose = () => {
    setEditPanelOpened(false);
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
          title={!!currentId ? '编辑账号' : '新建账号'}
          placement='right'
          width={600}
          onClose={onClose}
          open={editPanelOpened}
          extra={
            <Space>
              <Button type='primary' icon={<SaveOutlined />} onClick={handleSaveAccount}>保存</Button>
            </Space>
          }
        >
          <EditPanel form={editPanelForm} />
          {currentId &&
            <VMOperator
              canLaunch={!currentAccount.onLine}
              onLaunch={() => store.launchAccounts([currentId])}
              onShutDown={() => store.shutDownAccounts([currentId])}
            />
          }
        </Drawer>
      </div>
    </Page>
  );
});

AccountManager.displayName = 'AccountManager';

export default AccountManager;

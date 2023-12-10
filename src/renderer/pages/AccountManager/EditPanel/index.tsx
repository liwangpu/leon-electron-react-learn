import { memo } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { FormInstance } from 'antd/es/form/hooks/useForm';
import styles from './index.module.scss';
import Operator from '../AccountOperator';
import AccountOperator from '../AccountOperator';

export interface IEditorPanelProps {
  form: FormInstance;
}

const EditPanel: React.FC<IEditorPanelProps> = memo(props => {

  const { form } = props;

  return (
    <div className={styles['panel']}>
      <div className={styles['panel__content']}>
        <Form
          // layout='inline'
          form={form}
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          // size='small'
          // validateTrigger=''
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label='账号'
                name='account'
                rules={[
                  { required: true, message: '账号为必填信息' }
                ]}
              >
                <Input placeholder='请输入账号' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='密码'
                name='password'
                rules={[
                  { required: true, message: '密码为必填信息' }
                ]}
              >
                <Input placeholder='请输入密码' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div className={styles['panel__footer']}>
        <AccountOperator />
      </div>
    </div>
  );
});

EditPanel.displayName = 'EditPanel';

export default EditPanel;

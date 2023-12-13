import { memo } from 'react';
import { Button } from 'antd';
import styles from './index.module.scss';

export interface IVMOperatorProps {
  canLaunch?: boolean;

  onLaunch(): void;

  onShutDown(): void;
}

const VMOperator: React.FC<IVMOperatorProps> = memo(props => {
  const { canLaunch, onLaunch, onShutDown } = props;
  return (
    <div className={styles['operator']}>
      <Button type='primary' disabled={!canLaunch} onClick={onLaunch}>打开</Button>
      <Button danger type='primary' disabled={canLaunch} onClick={onShutDown}>关闭</Button>
    </div>
  );
});

VMOperator.displayName = 'VMOperator';

export default VMOperator;

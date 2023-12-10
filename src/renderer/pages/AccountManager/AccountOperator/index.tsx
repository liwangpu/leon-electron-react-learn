import { memo } from 'react';
import { Button } from 'antd';

export interface IAccountOperatorProps {
  canLaunch?: boolean;
  // launch(): void;
}

const AccountOperator: React.FC<IAccountOperatorProps> = memo(props => {

  return (
    <div>
      <Button>打开</Button>
      <Button>登录</Button>
    </div>
  );
});

AccountOperator.displayName = 'AccountOperator';

export default AccountOperator;

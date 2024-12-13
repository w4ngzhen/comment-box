import { baseClassSupplier } from '../../../utils/class-utils';
import './index.less';

const baseCls = baseClassSupplier('error-tip');

export const ErrorTip = (props: { error: string }) => {
  const { error } = props;
  return <div className={baseCls()}>{error}</div>;
};

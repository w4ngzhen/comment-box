import { baseClassSupplier, cls } from '../../../../utils/class-utils';
import './index.less';
import { CSSProperties } from 'preact/compat';

const baseCls = baseClassSupplier('icon-loading');
export const IconLoading = (props: {
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div className={cls(baseCls(), props.className)} style={props.style} />
  );
};

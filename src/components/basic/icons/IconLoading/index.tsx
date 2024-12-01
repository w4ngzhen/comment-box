import { baseClassSupplier } from '../../../../styles/class-utils';
import './index.less';
import { CSSProperties } from 'preact/compat';
import { cls } from '../../../../utils';

const baseCls = baseClassSupplier('icon-loading');
export const IconLoading = (props: {
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div className={cls(baseCls(), props.className)} style={props.style} />
  );
};

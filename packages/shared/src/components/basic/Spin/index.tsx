import { CSSProperties } from 'preact/compat';
import { baseClassSupplier, cls } from '../../../utils/class-utils';
import './index.less';
import { IconLoading } from '../icons/IconLoading';

const baseCls = baseClassSupplier('spin');

export function Spin(props: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={cls(baseCls(), props.className)}
      style={{
        ...(props.style || {}),
      }}
    >
      <IconLoading />
    </div>
  );
}

import { baseClassSupplier } from '../../styles/class-utils';
import './index.less';
import { CSSProperties, useState } from 'preact/compat';
import { cls } from '../../utils';

const baseCls = baseClassSupplier('edit-panel');

interface EditPanelProps {
  onCommentSendClick?: (content: string) => void;
  className?: string;
}

export const EditPanel = (props: EditPanelProps) => {
  const { onCommentSendClick, className } = props;
  const [inputContent, setInputContent] = useState<string>(undefined);

  const [focused, setFocused] = useState<boolean>(false);

  const isDisabled = !inputContent;

  const onSendCommentClick = () => {
    if (isDisabled) {
      return;
    }
    const ok = confirm('Do you want send this comment?');
    if (!ok) {
      return;
    }
    onCommentSendClick?.(inputContent);
  };

  return (
    <div
      className={cls(baseCls(), focused ? baseCls('focused') : null, className)}
    >
      <textarea
        className={baseCls('input')}
        value={inputContent}
        onChange={(e: Event) => {
          setInputContent((e.target as any)?.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <div className={baseCls('actions')}>
        <button
          className={cls(
            baseCls('actions-send-btn'),
            isDisabled ? baseCls('actions-send-btn-disabled') : null,
          )}
          onClick={onSendCommentClick}
        >
          <IconSend />
        </button>
      </div>
    </div>
  );
};

function IconSend(props: { style?: CSSProperties }) {
  return (
    <svg
      t="1732965860885"
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4256"
      width="200"
      height="200"
      style={{ ...(props.style || {}) }}
    >
      <path
        d="M832.170667 88.618667a82.944 82.944 0 0 1 82.346666 21.589333c21.461333 21.76 29.397333 53.632 20.650667 83.072l-53.290667 179.285333a32 32 0 1 1-61.312-18.432l53.290667-179.328a19.029333 19.029333 0 0 0-4.778667-19.285333 18.944 18.944 0 0 0-19.114666-4.992L163.370667 350.165333a18.901333 18.901333 0 0 0-13.824 16.085334 19.029333 19.029333 0 0 0 9.088 19.2l144.469333 88.917333a32.341333 32.341333 0 0 1 10.581333 44.330667 31.957333 31.957333 0 0 1-43.946666 10.666666l-144.469334-88.96a82.986667 82.986667 0 0 1-39.168-82.773333 82.730667 82.730667 0 0 1 59.52-69.418667l686.506667-199.594666zM769.194667 526.933333c5.12-17.066667 22.912-26.794667 39.850666-21.632 16.938667 5.12 26.581333 23.04 21.504 40.106667l-99.072 333.397333a82.517333 82.517333 0 0 1-69.290666 59.178667 82.090667 82.090667 0 0 1-81.834667-39.637333l-174.933333-289.706667a32.384 32.384 0 0 1 4.693333-39.466667l248.405333-249.984a31.829333 31.829333 0 0 1 45.226667 0 32.341333 32.341333 0 0 1 0 45.568l-230.570667 232.106667 161.877334 268.032a18.773333 18.773333 0 0 0 18.986666 9.216 18.901333 18.901333 0 0 0 16.085334-13.738667l99.072-333.44z"
        fill="currentColor"
        p-id="4257"
      ></path>
    </svg>
  );
}

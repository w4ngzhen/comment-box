import { baseClassSupplier } from '../../styles/class-utils';
import './index.less';
import { useState } from 'preact/compat';
import { cls } from '../../utils';
import { IconSend } from '../basic/icons/IconSend';
import { IconLoading } from '../basic/icons/IconLoading';

const baseCls = baseClassSupplier('edit-panel');

interface EditPanelProps {
  loading?: boolean;
  onCommentSendClick?: (content: string) => void;
  className?: string;
}

export const EditPanel = (props: EditPanelProps) => {
  const { loading, onCommentSendClick, className } = props;
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
    <div className={cls(baseCls(), focused && baseCls('focused'), className)}>
      <div></div>
      <textarea
        disabled={loading}
        className={cls(baseCls('input'), loading && baseCls('input-disabled'))}
        value={inputContent}
        onChange={(e: Event) => {
          setInputContent((e.target as any)?.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={'Leave some comments here'}
      />
      <div className={baseCls('actions')}>
        <button
          className={cls(
            baseCls('actions-send-btn'),
            (loading || isDisabled) && baseCls('actions-send-btn-disabled'),
          )}
          onClick={onSendCommentClick}
        >
          {loading ? <IconLoading /> : <IconSend />}
        </button>
      </div>
    </div>
  );
};

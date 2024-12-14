import './index.less';
import { useState } from 'preact/compat';
import {
  cls,
  IconLoading,
  IconSend,
  UserInfo,
} from 'comment-box-shared';
import { baseClassSupplier } from '../../utils';

const baseCls = baseClassSupplier('panel-edit');

interface PanelEditProps {
  userInfo: UserInfo;
  loading?: boolean;
  onCommentSendClick?: (content: string) => void;
  onLogoutClick?: () => void;
  className?: string;
}

export const PanelEdit = (props: PanelEditProps) => {
  const { userInfo, loading, onCommentSendClick, onLogoutClick, className } =
    props;
  const [inputContent, setInputContent] = useState<string>(undefined);
  const [showLogoutBtn, setShowLogoutBtn] = useState(false);

  const [focused, setFocused] = useState<boolean>(false);

  const isDisabled = !inputContent;

  return (
    <div className={cls(baseCls(), focused && baseCls('focused'), className)}>
      <div className={baseCls('info')}>
        <img
          onClick={() => setShowLogoutBtn((prev) => !prev)}
          className={baseCls('info-avatar')}
          src={userInfo.avatar_url}
          alt={'current user avatar'}
        />
        <div
          className={baseCls('info-logout-btn')}
          style={{ visibility: showLogoutBtn ? 'visible' : 'hidden' }}
        >
          <button
            onClick={() => {
              if (confirm('Are you sure to logout ➡️ ?')) {
                onLogoutClick?.();
              }
            }}
          >
            logout
          </button>
        </div>
      </div>
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
          onClick={() => {
            if (!isDisabled && confirm('Do you want send this comment?')) {
              onCommentSendClick?.(inputContent);
            }
          }}
        >
          {loading ? <IconLoading /> : <IconSend />}
        </button>
      </div>
    </div>
  );
};

import './index.less';
import { useContext } from 'preact/compat';
import { OptionsContext } from '../../contexts/OptionsContext';
import { cls } from 'comment-box-shared';
import { baseClassSupplier } from '../../utils';

const baseCls = baseClassSupplier('panel-login');

interface PanelLoginProps {
  className?: string;
}

export const PanelLogin = (props: PanelLoginProps) => {
  const { className } = props;
  const opts = useContext(OptionsContext);
  const { authCallbackUrl, clientId } = opts;
  const onClick = () => {
    window.location.href = getAuthUrl(authCallbackUrl, clientId);
  };
  return (
    <div className={cls(baseCls(), className)}>
      <button className={baseCls('login-btn')} onClick={onClick}>
        login with GitHub
      </button>
    </div>
  );
};

function getAuthUrl(callbackUrl: string, clientId: string) {
  const currentPageUrl = window.location.href;
  const encodedPageUrl = encodeURIComponent(currentPageUrl);
  const redirectUri = `${callbackUrl}?r=${encodedPageUrl}`;
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodedRedirectUri}`;
}

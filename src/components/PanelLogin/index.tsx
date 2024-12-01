import { baseClassSupplier } from '../../styles/class-utils';
import { cls } from '../../utils';
import './index.less';
import { useContext } from 'preact/compat';
import { OptionsContext } from '../../contexts/OptionsContext';

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
        login
      </button>
    </div>
  );
};

function getAuthUrl(callbackUrl: string, clientId: string) {
  // todo 上述参数需要对应自己的服务和CLIENT_ID
  const currentPageUrl = window.location.href;
  const encodedPageUrl = encodeURIComponent(currentPageUrl);
  const redirectUri = `${callbackUrl}?r=${encodedPageUrl}`;
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodedRedirectUri}`;
}

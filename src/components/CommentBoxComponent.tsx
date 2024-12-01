import { OptionsContext } from '../contexts/OptionsContext';
import { CommentList } from './CommentList';
import { useEffect, useLayoutEffect, useState } from 'preact/compat';
import './index.less';
import { baseClassSupplier } from '../styles/class-utils';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { getUserInfo, UserInfo } from '../api/getUserInfo';
import { PanelEdit } from './PanelEdit';
import { PanelLogin } from './PanelLogin';

const baseCls = baseClassSupplier('root');

interface CommentBoxComponentProps {
  options: Options;
}

type UserLoginStatus = 'noLogin' | 'loading' | 'login';

type StorageUserInfo = {} & UserInfo;

export const CommentBoxComponent = (props: CommentBoxComponentProps) => {
  const { options } = props;
  const { commentPageSize = 20, ...restOpts } = options;
  const [sendLoading, setSendLoading] = useState(false);
  // 用户信息加载
  const [userLoadingStatus, setUserLoadingStatus] =
    useState<UserLoginStatus>('noLogin');

  const [userInfo, setUserInfo] = useLocalStorageState<StorageUserInfo>(
    undefined,
    '$COMMENT_BOX_USER_INFO$',
  );

  useLayoutEffect(() => {
    console.debug('Mount instant success.');
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get('access_token');
    if (userInfo) {
      // 存在用户信息，直接使用
      setUserLoadingStatus('login');
      return;
    }
    if (!accessToken) {
      // 不存在用户信息，url上也没有access_token，进入noLogin状态
      setUserLoadingStatus('noLogin');
      return;
    }
    // 存在access_token，调用github接口获取用户信息
    getUserInfo(accessToken).then((userInfo) => {
      let info: StorageUserInfo = {
        ...userInfo,
        accessToken,
      };
      setUserInfo(info);
      query.delete('access_token');
      window.location.href = window.location.host + query.toString();
    });
  }, []);

  const onCommentSendClick = async (comment: string) => {
    setSendLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  if (userLoadingStatus === 'loading') {
    return <div>loading...</div>;
  }

  const renderPanel = () => {
    if (userLoadingStatus === 'noLogin') {
      return <PanelLogin />;
    }
    return (
      <PanelEdit
        loading={sendLoading}
        className={baseCls('panel-edit-wrapper')}
        onCommentSendClick={onCommentSendClick}
      />
    );
  };

  return (
    <OptionsContext.Provider
      value={{
        ...restOpts,
        commentPageSize,
      }}
    >
      {renderPanel()}
      <CommentList />
    </OptionsContext.Provider>
  );
};

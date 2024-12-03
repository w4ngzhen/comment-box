import { OptionsContext } from '../contexts/OptionsContext';
import { CommentList } from './CommentList';
import { useEffect, useLayoutEffect, useState } from 'preact/compat';
import './index.less';
import { baseClassSupplier } from '../styles/class-utils';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { getUserInfo, UserInfo } from '../api/getUserInfo';
import { PanelEdit } from './PanelEdit';
import { PanelLogin } from './PanelLogin';
import { Spin } from './basic/Spin';
import { useIssue } from '../hooks/useIssue';
import { addCommentToIssue } from '../api/addCommentToIssue';

const baseCls = baseClassSupplier('root');

interface CommentBoxComponentProps {
  options: Options;
}

type UserLoginStatus = 'noLogin' | 'loading' | 'login';

type StorageUserInfo = { accessToken: string } & UserInfo;

export const CommentBoxComponent = (props: CommentBoxComponentProps) => {
  const { options } = props;
  const { commentPageSize = 20, ...restOpts } = options;
  const {
    loading: issueLoading,
    error: loadIssueErr,
    issue,
  } = useIssue(options);
  const [sendLoading, setSendLoading] = useState(false);
  // 用户信息加载
  const [userLoadingStatus, setUserLoadingStatus] =
    useState<UserLoginStatus>('noLogin');

  const [userInfo, setUserInfo] = useLocalStorageState<StorageUserInfo>(
    undefined,
    '$COMMENT_BOX_USER_INFO$',
  );

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const tokenUrlKey = 'gh_access_token';
    const accessToken = query.get(tokenUrlKey);
    if (userInfo) {
      // 存在用户信息，直接使用，但是需要清理掉url上的参数
      // 清理access_token
      if (accessToken) {
        query.delete(tokenUrlKey);
        window.location.href = `${window.location.origin}?${query.toString()}`;
      }
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
      query.delete(tokenUrlKey);
      window.location.href = `${window.location.origin}?${query.toString()}`;
    });
  }, []);

  const onCommentSendClick = async (comment: string) => {
    setSendLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  if (issueLoading || userLoadingStatus === 'loading') {
    return (
      <div style={{ width: '100px' }}>
        <Spin />
      </div>
    );
  }

  if (!issueLoading && loadIssueErr) {
    return <div>{`load issue err: ${loadIssueErr}`}</div>;
  }

  const renderPanel = () => {
    if (userLoadingStatus === 'noLogin' || !userInfo) {
      return <PanelLogin />;
    }
    return (
      <PanelEdit
        userInfo={userInfo}
        loading={sendLoading}
        className={baseCls('panel-edit-wrapper')}
        onCommentSendClick={async (commentContent) => {
          await addCommentToIssue({
            accessToken: userInfo.accessToken,
            comment: commentContent,
            issueNumber: issue.number,
            owner: options.owner,
            repo: options.repo,
          });
        }}
        onLogoutClick={() => {
          setUserLoadingStatus('noLogin');
          setUserInfo(undefined);
        }}
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
      <CommentList issue={issue} />
    </OptionsContext.Provider>
  );
};

import { OptionsContext } from '../contexts/OptionsContext';
import { CommentList } from './CommentList';
import { useEffect, useState } from 'preact/compat';
import './index.less';
import { baseClassSupplier } from '../styles/class-utils';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { getUserInfo, UserInfo } from '../api/getUserInfo';
import { PanelEdit } from './PanelEdit';
import { PanelLogin } from './PanelLogin';
import { Spin } from './basic/Spin';
import { useIssue } from '../hooks/useIssue';
import { addCommentToIssue } from '../api/addCommentToIssue';
import {
  getCommentsWithTargetIssue,
  IssueComment,
} from '../api/getCommentsWithTargetIssue';
import { ErrorTip } from './basic/ErrorTip';
import { Issue } from '../api/getIssueWithTargetLabel';

const baseCls = baseClassSupplier('root');

interface CommentBoxComponentProps {
  options: Options;
}

type UserLoginStatus = 'noLogin' | 'loading' | 'login';

type StorageUserInfo = { accessToken: string } & UserInfo;

export const CommentBoxComponent = (props: CommentBoxComponentProps) => {
  const { options } = props;
  const { commentLatestSize = 20, ...restOpts } = options;

  // issue加载
  const {
    loading: issueLoading,
    error: loadIssueErr,
    issue,
  } = useIssue(options);

  // comments
  const [loadCommentsResult, setCommentsLoadingResult] = useState<{
    loading: boolean;
    error?: string;
    comments?: IssueComment[];
  }>({
    loading: true,
  });

  // comment发送loading
  const [sendLoading, setSendLoading] = useState(false);

  // 用户信息加载
  const [userLoadingStatus, setUserLoadingStatus] =
    useState<UserLoginStatus>('noLogin');

  const [userInfo, setUserInfo] = useLocalStorageState<StorageUserInfo>(
    undefined,
    '$COMMENT_BOX_USER_INFO$',
  );

  /**
   * 登录回调处理逻辑
   */
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

  const loadComments = async (issueInfo: Issue) => {
    setCommentsLoadingResult({
      loading: true,
    });
    let accept: string;
    const { owner, repo, commentContentRenderStyle: renderStyle } = options;
    if (renderStyle === 'both') {
      accept = 'application/vnd.github.full+json';
    } else if (renderStyle === 'rich') {
      accept = 'application/vnd.github.html+json';
    } else {
      // 兜底用纯文本
      accept = 'application/vnd.github.text+json';
    }
    try {
      const comments = await getCommentsWithTargetIssue(
        {
          owner,
          repo,
          issueNumber: issueInfo.number,
          totalCommentLen: issueInfo.comments,
          commentLatestSize,
        },
        {
          Accept: accept,
        },
      );
      setCommentsLoadingResult({
        loading: false,
        comments: comments,
      });
    } catch (e) {
      console.error(e);
      setCommentsLoadingResult({
        loading: false,
        error: e.message,
      });
    }
  };

  useEffect(() => {
    if (issueLoading || loadIssueErr) {
      return;
    }
    loadComments(issue).then();
  }, [issueLoading, loadIssueErr, issue]);

  if (issueLoading || userLoadingStatus === 'loading') {
    return <Spin />;
  }

  if (!issueLoading && loadIssueErr) {
    return <ErrorTip error={loadIssueErr} />;
  }

  const renderPanel = () => {
    if (userLoadingStatus === 'noLogin' || !userInfo) {
      return <PanelLogin className={baseCls('panel-login-wrapper')} />;
    }
    return (
      <PanelEdit
        userInfo={userInfo}
        loading={sendLoading}
        className={baseCls('panel-edit-wrapper')}
        onCommentSendClick={async (commentContent) => {
          try {
            setSendLoading(true);
            await addCommentToIssue({
              accessToken: userInfo.accessToken,
              comment: commentContent,
              issueNumber: issue.number,
              owner: options.owner,
              repo: options.repo,
            });
            await loadComments(issue);
          } catch (e) {
            console.error('send comment err: ', e);
          } finally {
            setSendLoading(false);
          }
        }}
        onLogoutClick={() => {
          setUserLoadingStatus('noLogin');
          setUserInfo(undefined);
        }}
      />
    );
  };

  const renderCommentList = () => {
    if (issueLoading || loadIssueErr) {
      return;
    }
    const { loading, error, comments } = loadCommentsResult;
    if (loading) {
      return <Spin />;
    }
    if (error) {
      return <ErrorTip error={error} />;
    }
    console.debug(comments);
    return <CommentList issue={issue} comments={comments} />;
  };

  return (
    <OptionsContext.Provider
      value={{
        ...restOpts,
        commentLatestSize,
      }}
    >
      <div className={baseCls()}>
        <div className={baseCls('center')}>
          {renderPanel()}
          {renderCommentList()}
        </div>
      </div>
    </OptionsContext.Provider>
  );
};

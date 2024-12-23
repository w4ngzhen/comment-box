import { OptionsContext } from '../contexts/OptionsContext';
import { useEffect, useState } from 'preact/compat';
import './index.less';
import {
  CommentList,
  ErrorTip,
  getCommentsWithTargetIssue,
  IconArrow,
  Issue,
  IssueComment,
  Spin,
  useIssue,
} from 'comment-box-shared';
import { Options } from '../interface';
import { baseClassSupplier } from '../utils';

const baseCls = baseClassSupplier('root');

interface CommentBoxComponentProps {
  options: Options;
}

export const CommentBoxComponent = (props: CommentBoxComponentProps) => {
  const { options } = props;
  const { commentLatestSize = 20, ...restOpts } = options;

  // issue加载
  const {
    loading: issueLoading,
    error: loadIssueErr,
    issue,
  } = useIssue({
    owner: options.owner,
    repo: options.repo,
    issueLabel: options.issueLabel,
  });

  // comments
  const [loadCommentsResult, setCommentsLoadingResult] = useState<{
    loading: boolean;
    error?: string;
    comments?: IssueComment[];
  }>({
    loading: true,
  });

  const loadComments = async (issueInfo: Issue) => {
    setCommentsLoadingResult({
      loading: true,
    });
    let accept: string;
    const { owner, repo, commentContentRenderStyle: renderStyle } = options;
    if (renderStyle === 'rich') {
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

  if (issueLoading) {
    return <Spin />;
  }

  if (!issueLoading && loadIssueErr) {
    return <ErrorTip error={loadIssueErr} />;
  }

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
    return (
      <CommentList
        issue={issue}
        comments={comments}
        commentLatestSize={options.commentLatestSize}
      />
    );
  };

  const onLeaveMsgButtonClick = () => {
    if (confirm('前往对应issue下进行留言？')) {
      window.open(issue.html_url, '_blank');
    }
  };

  return (
    <OptionsContext.Provider
      value={{
        ...restOpts,
        commentLatestSize,
      }}
    >
      <div className={baseCls()}>
        <button
          className={baseCls('leave-msg-button')}
          onClick={onLeaveMsgButtonClick}
        >
          <span>Leave a message</span>
          <IconArrow />
        </button>
        <div className={baseCls('content')}>{renderCommentList()}</div>
      </div>
    </OptionsContext.Provider>
  );
};

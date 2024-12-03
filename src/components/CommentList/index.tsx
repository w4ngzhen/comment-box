import { useComments } from '../../hooks/useComments';
import { Comment } from '../Comment';
import { baseClassSupplier } from '../../styles/class-utils';
import './index.less';
import { Fragment } from 'preact';
import { Spin } from '../basic/Spin';
import { Issue } from '../../api/getIssueWithTargetLabel';
import { useContext } from 'preact/compat';
import { OptionsContext } from '../../contexts/OptionsContext';
import { IconJump } from '../basic/icons/IconJump';

const baseClass = baseClassSupplier('comment-list');

interface CommentListProps {
  issue: Issue;
}

export const CommentList = (props: CommentListProps) => {
  const { issue } = props;
  // 默认从第一页开始
  const { loading, error, comments } = useComments(issue);
  const { commentLatestSize } = useContext(OptionsContext);

  if (loading) {
    return <Spin />;
  }

  const renderList = () => {
    if (error) {
      return <div style={{ width: '100px' }}>{error}</div>;
    }
    return (
      <Fragment>
        <div className={baseClass('content')}>
          {comments.map((comment) => {
            return (
              <Comment
                issueComment={comment}
                className={baseClass('content-item-wrapper')}
              />
            );
          })}
        </div>
        {issue.comments > commentLatestSize ? (
          <div className={baseClass('more-btn')}>
            <button
              onClick={() => {
                window.open(issue.html_url);
              }}
            >
              more
              <IconJump />
            </button>
          </div>
        ) : null}
      </Fragment>
    );
  };

  return <Fragment>{renderList()}</Fragment>;
};

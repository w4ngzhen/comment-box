import { Comment } from '../Comment';
import { baseClassSupplier } from '../../styles/class-utils';
import './index.less';
import { Issue } from '../../api/getIssueWithTargetLabel';
import { useContext } from 'preact/compat';
import { OptionsContext } from '../../contexts/OptionsContext';
import { IconArrow } from '../basic/icons/IconArrow';
import { IssueComment } from '../../api/getCommentsWithTargetIssue';

const baseClass = baseClassSupplier('comment-list');

interface CommentListProps {
  issue: Issue;
  comments: IssueComment[];
}

export const CommentList = (props: CommentListProps) => {
  const { issue, comments } = props;
  const { commentLatestSize } = useContext(OptionsContext);
  return (
    <div className={baseClass()}>
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
            <IconArrow />
          </button>
        </div>
      ) : null}
    </div>
  );
};

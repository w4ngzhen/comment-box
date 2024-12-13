import { Comment } from '../Comment';
import { baseClassSupplier } from '../../utils';
import './index.less';
import { Issue } from '../../api';
import { IconArrow } from '../basic';
import { IssueComment } from '../../api';

const baseClass = baseClassSupplier('comment-list');

interface CommentListProps {
  issue: Issue;
  comments: IssueComment[];
  commentLatestSize: number;
}

export const CommentList = (props: CommentListProps) => {
  const { issue, comments = [], commentLatestSize = 10 } = props;
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

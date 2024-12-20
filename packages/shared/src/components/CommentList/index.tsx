import { Comment } from '../Comment';
import './index.less';
import { Issue } from '../../api';
import { IconArrow } from '../basic';
import { IssueComment } from '../../api';
import { baseClassSupplier } from '../../utils/class-utils';

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
              if (confirm('前往对应issue查看更多留言？')) {
                window.open(issue.html_url);
              }
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

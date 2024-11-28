import { useComments } from '../../hooks/useComments';
import { Comment } from '../Comment';
import { baseClassSupplier } from '../../styles/class-utils';
import './index.less';
import { Fragment } from 'preact';

const baseClass = baseClassSupplier('comment-list');

interface CommentListProps {}

export const CommentList = (props: CommentListProps) => {
  const {} = props;
  const {
    initLoading,
    initError,
    commentLoading,
    totalPageNumber,
    comments,
    requestComments,
  } = useComments();
  if (initLoading) {
    return <div>init loading</div>;
  } else if (initError) {
    return <div>{initError}</div>;
  }
  return (
    <Fragment>
      <button onClick={() => requestComments(1)}>load</button>
      {totalPageNumber}
      <div className={baseClass()}>
        {comments.map((comment) => {
          return (
            <Comment
              issueComment={comment}
              className={baseClass('item-wrapper')}
            />
          );
        })}
      </div>
    </Fragment>
  );
};

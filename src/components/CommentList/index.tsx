import { useComments } from '../../hooks/useComments';
import { Comment } from '../Comment';
import { baseClassSupplier } from '../../styles/class-utils';
import './index.less';
import { Fragment } from 'preact';
import { useEffect, useState } from 'preact/compat';
import { cls } from '../../utils';
import { SimplePagination } from '../basic/Pagination';
import { Spin } from '../basic/Spin';

const baseClass = baseClassSupplier('comment-list');

interface CommentListProps {}

export const CommentList = (props: CommentListProps) => {
  const {} = props;
  // 默认从第一页开始
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    initLoading,
    initError,
    commentLoading,
    totalPageNumber,
    comments,
    requestComments,
  } = useComments();

  useEffect(() => {
    if (initLoading || initError) {
      return;
    }
    if (currentPage > totalPageNumber) {
      return;
    }
    console.debug(`prepare request page#${currentPage} data.`);
    requestComments(currentPage).then(() => {
      console.debug(`request page#${currentPage} data finished.`);
    });
  }, [initLoading, initError, currentPage, totalPageNumber]);

  if (initLoading) {
    return <div>init loading</div>;
  } else if (initError) {
    return <div>{initError}</div>;
  }

  const renderList = () => {
    if (commentLoading) {
      return (
        <div style={{ width: '100px' }}>
          <Spin />
        </div>
      );
    }
    return (
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
    );
  };

  return (
    <Fragment>
      {renderList()}
      <SimplePagination
        disabled={commentLoading}
        totalPage={totalPageNumber}
        currentPage={currentPage}
        className={baseClass('pagination')}
        onPageChange={(pageNum) => setCurrentPage(pageNum)}
      />
    </Fragment>
  );
};

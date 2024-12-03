import { useComments } from '../../hooks/useComments';
import { Comment } from '../Comment';
import { baseClassSupplier } from '../../styles/class-utils';
import './index.less';
import { Fragment } from 'preact';
import { useEffect, useState } from 'preact/compat';
import { cls } from '../../utils';
import { SimplePagination } from '../basic/Pagination';
import { Spin } from '../basic/Spin';
import { Issue } from '../../api/getIssueWithTargetLabel';

const baseClass = baseClassSupplier('comment-list');

interface CommentListProps {
  issue: Issue;
}

export const CommentList = (props: CommentListProps) => {
  const { issue } = props;
  // 默认从第一页开始
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { commentLoading, totalPageNumber, comments, requestComments } =
    useComments(issue);

  useEffect(() => {
    if (currentPage > totalPageNumber) {
      return;
    }
    console.debug(`prepare request page#${currentPage} data.`);
    requestComments(currentPage).then(() => {
      console.debug(`request page#${currentPage} data finished.`);
    });
  }, [currentPage, totalPageNumber]);

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

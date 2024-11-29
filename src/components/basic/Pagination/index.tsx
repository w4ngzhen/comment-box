import { cls } from '../../../utils';
import { baseClassSupplier } from '../../../styles/class-utils';
import './index.less';

const paginationCls = baseClassSupplier('pagination');

export function SimplePagination(props: {
  totalPage: number;
  currentPage: number;
  onPageChange?: (pageNum: number) => void;
  disabled?: boolean;
  className?: string;
}) {
  const { totalPage, currentPage, onPageChange, className, disabled } = props;
  return (
    <div className={cls(paginationCls(), className)}>
      {Array.from({ length: totalPage }).map((_, idx) => {
        const pageNum = idx + 1;
        return (
          <span
            className={cls(
              paginationCls('item'),
              pageNum === currentPage ? paginationCls('item-activated') : null,
              disabled ? paginationCls('item-disabled') : null,
            )}
            onClick={() => {
              if (disabled) {
                return;
              }
              if (currentPage !== pageNum) {
                onPageChange?.(pageNum);
              }
            }}
          >
            {pageNum}
          </span>
        );
      })}
    </div>
  );
}

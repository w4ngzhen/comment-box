import { OptionsContext } from '../contexts/OptionsContext';
import { CommentList } from './CommentList';
import { useLayoutEffect } from 'preact/compat';
import { EditPanel } from './EditPanel';
import './index.less';
import { baseClassSupplier } from '../styles/class-utils';

interface CommentBoxComponentProps {
  options: Options;
}

const baseCls = baseClassSupplier('root');

export const CommentBoxComponent = (props: CommentBoxComponentProps) => {
  const { options } = props;
  const { commentPageSize = 20, ...restOpts } = options;
  useLayoutEffect(() => {
    console.debug('Mount instant success.');
  }, []);
  return (
    <OptionsContext.Provider
      value={{
        ...restOpts,
        commentPageSize,
      }}
    >
      <EditPanel className={baseCls('edit-panel-wrapper')} />
      <CommentList />
    </OptionsContext.Provider>
  );
};

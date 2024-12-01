import { OptionsContext } from '../contexts/OptionsContext';
import { CommentList } from './CommentList';
import { useLayoutEffect, useState } from 'preact/compat';
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
  const [sendLoading, setSendLoading] = useState(false);

  useLayoutEffect(() => {
    console.debug('Mount instant success.');
  }, []);
  const onCommentSendClick = async (comment: string) => {
    setSendLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
  return (
    <OptionsContext.Provider
      value={{
        ...restOpts,
        commentPageSize,
      }}
    >
      <EditPanel
        loading={sendLoading}
        className={baseCls('edit-panel-wrapper')}
        onCommentSendClick={onCommentSendClick}
      />
      <CommentList />
    </OptionsContext.Provider>
  );
};

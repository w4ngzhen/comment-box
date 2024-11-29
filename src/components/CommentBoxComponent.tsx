import { OptionsContext } from '../contexts/OptionsContext';
import { CommentList } from './CommentList';
import { useLayoutEffect } from 'preact/compat';

interface CommentBoxComponentProps {
  options: Options;
}

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
      <CommentList />
    </OptionsContext.Provider>
  );
};

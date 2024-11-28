import { OptionsContext } from '../contexts/OptionsContext';
import { CommentList } from './CommentList';

interface BoxProps {
  options: Options;
}

export const CommentBoxComponent = (props: BoxProps) => {
  const { options } = props;
  const { commentPageSize = 20, ...restOpts } = options;
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

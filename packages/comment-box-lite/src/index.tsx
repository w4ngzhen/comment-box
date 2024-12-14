import { render } from 'preact';
import { CommentBoxComponent } from './components/CommentBoxComponent';
import { Options } from './interface';

export function init(mountEle: string, opts: Options) {
  if (!opts) {
    console.error('CommentBox初始化失败：初始化参数对象为空');
    return;
  }
  const validateNonEmpty = (keys: Array<keyof Options>): boolean => {
    if (!keys?.length) {
      return false;
    }
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!opts[key]) {
        console.error(`CommentBox初始化失败：初始化参数 ${key} 为空`);
        return false;
      }
    }
    return true;
  };
  if (!validateNonEmpty(['owner', 'issueKey', 'repo'])) {
    return;
  }
  console.debug('Prepare mount CommentBox instant');
  render(
    <CommentBoxComponent options={opts} />,
    document.querySelector(mountEle || '#comment-box'),
  );
}

init('#comment-box', {
  issueKey: 'test',
  owner: 'w4ngzhen',
  repo: 'blog',
  commentContentRenderStyle: 'pure',
  commentLatestSize: 10,
});

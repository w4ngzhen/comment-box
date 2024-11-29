import { IssueComment } from '../../hooks/useComments';
import './index.less';
import { baseClassSupplier } from '../../styles/class-utils';
import {
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/compat';
import { OptionsContext } from '../../contexts/OptionsContext';
import { cls } from '../../utils';
import * as dayjs from 'dayjs';

const baseClass = baseClassSupplier('comment');

interface CommentProps {
  issueComment: IssueComment;
  className?: string;
}

export const Comment = (props: CommentProps) => {
  const { issueComment, className } = props;
  const { commentContentRenderStyle } = useContext(OptionsContext);
  const { user, updated_at, created_at, reactions, body_html, body_text } =
    issueComment;
  const { avatar_url, login: userName, html_url: userUrl } = user;

  const time = useMemo(() => {
    const formatStr = 'YYYY/MM/DD HH:mm:ss';
    let updateTimeStr = dayjs(updated_at).format(formatStr);
    if (updated_at === created_at) {
      // 没有更新过
      return updateTimeStr;
    } else {
      const createdTime = dayjs(created_at);
      return `${createdTime.format(formatStr)} (updated at: ${updateTimeStr})`;
    }
  }, [created_at, updated_at]);

  return (
    <div className={cls(baseClass(), className)}>
      <div className={baseClass('avatar')}>
        <img src={avatar_url} alt={'user avatar'} />
      </div>
      <div className={baseClass('pane')}>
        <div className={baseClass('pane-header')}>
          <a
            className={baseClass('pane-header-name')}
            href={userUrl}
            target="_blank"
          >
            {userName}
          </a>
          <div className={baseClass('pane-header-datetime')}>{time}</div>
        </div>
        <div className={baseClass('pane-content')}>
          <CommentContent
            commentRenderStyle={commentContentRenderStyle}
            textStr={body_text}
            htmlStr={body_html}
          />
        </div>
      </div>
    </div>
  );
};

function CommentContent(props: {
  textStr?: string;
  htmlStr?: string;
  commentRenderStyle: Options['commentContentRenderStyle'];
}) {
  const { textStr, htmlStr, commentRenderStyle } = props;
  const [displayStyle, setDisplayStyle] =
    useState<typeof commentRenderStyle>('pure');

  const renderPureTextContent = () => <PureTextContent textStr={textStr} />;
  const renderRichTextContent = () => <RichTextContent htmlStr={htmlStr} />;

  if (commentRenderStyle === 'both') {
    return (
      <div
        className={baseClass('content-both')}
        onDoubleClick={() => {
          setDisplayStyle((prev) => {
            return prev === 'pure' ? 'rich' : 'pure';
          });
        }}
      >
        {displayStyle === 'pure'
          ? renderPureTextContent()
          : renderRichTextContent()}
      </div>
    );
  } else if (commentRenderStyle === 'rich') {
    return renderRichTextContent();
  } else {
    return renderPureTextContent();
  }
}

function PureTextContent(props: { textStr: string }) {
  return (
    <div
      className={baseClass('pane-content-pure-text')}
      style={{
        whiteSpace: 'pre-wrap', // 避免丢失换行（\n）
      }}
    >
      {props.textStr}
    </div>
  );
}

function RichTextContent(props: { htmlStr: string }) {
  const contentEleRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!contentEleRef.current) {
      return;
    }
    contentEleRef.current.innerHTML = props.htmlStr;
  }, [props.htmlStr, contentEleRef]);
  return (
    <div
      className={cls(baseClass('pane-content-rich-text'), 'markdown-body')}
      ref={contentEleRef}
    />
  );
}

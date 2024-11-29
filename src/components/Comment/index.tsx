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
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const baseClass = baseClassSupplier('comment');

interface CommentProps {
  issueComment: IssueComment;
  className?: string;
}

export const Comment = (props: CommentProps) => {
  const { issueComment, className } = props;
  const { commentContentRenderStyle } = useContext(OptionsContext);
  const {
    user,
    updated_at,
    created_at,
    reactions,
    body_html,
    body_text,
    html_url: commentUrl,
  } = issueComment;
  const { avatar_url, login: userName, html_url: userUrl } = user;

  const time = useMemo(() => {
    const updateTimeStr = dayjs(updated_at).fromNow();
    return `${updateTimeStr}${updated_at !== created_at ? ' (edited)' : ''}`;
  }, [created_at, updated_at]);

  return (
    <div className={cls(baseClass(), className)}>
      <div className={baseClass('avatar')}>
        <img
          src={avatar_url}
          alt={'user avatar'}
          title={userUrl}
          onClick={() => window.open(userUrl)}
        />
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
          <a
            className={baseClass('pane-header-datetime')}
            href={commentUrl}
            target="_blank"
            title={commentUrl}
          >
            {time}
          </a>
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

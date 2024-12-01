import { CommentReactionsKey, IssueComment } from '../../hooks/useComments';
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
  onReactionClick?: (key: CommentReactionsKey) => void;
}

const REACTION_ICONS: Record<CommentReactionsKey, string> = {
  '+1': '👍',
  heart: '❤️',
  confused: '😕',
};

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
      <div className={baseClass('panel')}>
        <div className={baseClass('panel-header')}>
          <a
            className={baseClass('panel-header-name')}
            href={userUrl}
            target="_blank"
          >
            {userName}
          </a>
          <a
            className={baseClass('panel-header-datetime')}
            href={commentUrl}
            target="_blank"
            title={commentUrl}
          >
            {time}
          </a>
        </div>
        <div className={baseClass('panel-content')}>
          <CommentContent
            commentRenderStyle={commentContentRenderStyle}
            textStr={body_text}
            htmlStr={body_html}
          />
        </div>
        <div className={baseClass('panel-reactions')}>
          {Object.keys(REACTION_ICONS).map((reaction) => {
            return (
              <span
                className={baseClass('panel-reactions-item')}
                onClick={() => {
                  confirm('');
                }}
              >
                {REACTION_ICONS[reaction]}
                <span className={baseClass('panel-reactions-item-count')}>
                  {reactions[reaction]}
                </span>
              </span>
            );
          })}
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
      className={baseClass('panel-content-pure-text')}
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
      className={cls(baseClass('panel-content-rich-text'), 'markdown-body')}
      ref={contentEleRef}
    />
  );
}

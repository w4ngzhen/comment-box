import './index.less';
import { baseClassSupplier, cls } from '../../utils';
import { useLayoutEffect, useMemo, useRef, useState } from 'preact/compat';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import { IssueComment } from '../../api';
import { CommentContentRenderStyle } from '../../interface';

dayjs.extend(relativeTime);

const baseClass = baseClassSupplier('comment-item');

interface CommentProps {
  issueComment: IssueComment;
  className?: string;
  contentRenderStyle?: CommentContentRenderStyle;
}

export const Comment = (props: CommentProps) => {
  const { issueComment, className, contentRenderStyle } = props;
  const {
    user,
    updated_at,
    created_at,
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
          alt={'comment user avatar'}
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
            contentRenderStyle={contentRenderStyle}
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
  contentRenderStyle: CommentContentRenderStyle;
}) {
  const { textStr, htmlStr, contentRenderStyle } = props;
  const [displayStyle, setDisplayStyle] =
    useState<typeof contentRenderStyle>('pure');

  const renderPureTextContent = () => <PureTextContent textStr={textStr} />;
  const renderRichTextContent = () => <RichTextContent htmlStr={htmlStr} />;

  if (contentRenderStyle === 'rich') {
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

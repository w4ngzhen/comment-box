import { useContext, useMemo, useState } from 'preact/compat';
import { OptionsContext } from '../contexts/OptionsContext';
import { Issue } from '../api/getIssueWithTargetLabel';

export interface IssueComment {
  user: {
    login: string;
    html_url: string;
    avatar_url: string;
  };
  html_url: string;
  body_html: string;
  body_text: string;
  body: string;
  created_at: string;
  updated_at: string;
  reactions: {
    '+1': number;
    heart: number;
    confused: number;
  };
}

export type CommentReactionsKey = keyof IssueComment['reactions'];

export const useComments = (issue: Issue) => {
  const opts = useContext(OptionsContext);
  const { commentContentRenderStyle } = opts;

  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<IssueComment[]>([]);

  const totalPageNumber = useMemo(() => {
    if (opts.commentPageSize <= 0) {
      return 0;
    }
    if (!issue || issue.comments <= 0) {
      return 0;
    }
    return Math.ceil(issue.comments / opts.commentPageSize);
  }, [opts.commentPageSize, issue]);

  /**
   * 无状态函数
   * @param pageNumber
   */
  const requestComments = async (pageNumber: number) => {
    setCommentLoading(true);
    const apiUrl = `${issue.comments_url}?page=${pageNumber}&per_page=${opts.commentPageSize}`;
    try {
      let accept: string;
      if (commentContentRenderStyle === 'both') {
        accept = 'application/vnd.github.full+json';
      } else if (commentContentRenderStyle === 'rich') {
        accept = 'application/vnd.github.html+json';
      } else {
        // 兜底用纯文本
        accept = 'application/vnd.github.text+json';
      }
      const resp = await fetch(apiUrl, {
        headers: {
          Accept: accept,
        },
      });
      if (!resp.ok) {
        setComments([]);
      }
      setComments(await resp.json());
    } catch (e) {
      setComments([]);
    } finally {
      setCommentLoading(false);
    }
  };

  return {
    commentLoading,
    totalPageNumber,
    comments,
    requestComments,
  };
};

import { useContext, useEffect, useState } from 'preact/compat';
import { OptionsContext } from '../contexts/OptionsContext';
import { Issue } from '../api/getIssueWithTargetLabel';
import { getCommentsWithTargetIssue } from '../api/getCommentsWithTargetIssue';

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
  const { commentContentRenderStyle, commentLatestSize } = opts;
  const { number: issueNum, comments: totalComments } = issue;
  const { owner, repo } = opts;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(undefined);
  const [comments, setComments] = useState<IssueComment[]>([]);

  useEffect(() => {
    if (!owner || !repo || !issueNum || !totalComments || !commentLatestSize) {
      return;
    }
    (async function load() {
      setLoading(true);
      let accept: string;
      if (commentContentRenderStyle === 'both') {
        accept = 'application/vnd.github.full+json';
      } else if (commentContentRenderStyle === 'rich') {
        accept = 'application/vnd.github.html+json';
      } else {
        // 兜底用纯文本
        accept = 'application/vnd.github.text+json';
      }
      try {
        const comments = await getCommentsWithTargetIssue(
          {
            owner,
            repo,
            issueNumber: issueNum,
            totalCommentLen: totalComments,
            commentLatestSize,
          },
          {
            Accept: accept,
          },
        );
        setComments(comments);
      } catch (e) {
        setError(e.message);
        setComments([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [owner, repo, issueNum, totalComments, commentLatestSize]);

  return {
    loading,
    error,
    comments,
  };
};

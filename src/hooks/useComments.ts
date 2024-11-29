import { useContext, useEffect, useMemo, useState } from 'preact/compat';
import { OptionsContext } from '../contexts/OptionsContext';

interface Issue {
  title: string;
  number: number;
  /**
   * 该Issue下comments的总条数，用于分页使用
   */
  comments: number;
  /**
   * 形如：
   * https://api.github.com/repos/w4ngzhen/blog/issues/${当前issue number}/comments
   * 直接通过该URL，可以获取对应issue下的评论
   */
  comments_url: string;
}

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
  };
}

export const useComments = () => {
  const opts = useContext(OptionsContext);
  const { owner, repo, issueKey, commentContentRenderStyle } = opts;
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [initError, setInitError] = useState<string>(undefined);

  const [issueInfo, setIssueInfo] = useState<Issue>(undefined);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<IssueComment[]>([]);

  const apiPrefix = `https://api.github.com/repos/${opts.owner}/${opts.repo}`;

  useEffect(() => {
    async function getIssueInfo() {
      let resp: Response;
      try {
        let getIssueUrl = `${apiPrefix}/issues?labels=${issueKey}&state=all`;
        resp = await fetch(getIssueUrl);
      } catch (e) {
        throw new Error(
          `获取仓库（${owner}/${resp}）下指定issue失败：${e.message}`,
        );
      }
      if (!resp.ok) {
        throw new Error(
          `获取仓库（${owner}/${repo}）下指定issue失败，status = ${resp.status}`,
        );
      }
      const issues = (await resp.json()) as Issue[];
      if (!issues.length) {
        throw new Error(`找不到仓库（${owner}/${repo}）下issue`);
      }
      return issues[0];
    }

    getIssueInfo()
      .then((issue) => {
        setIssueInfo(issue);
      })
      .catch((err) => setInitError(err.message));
  }, [opts]);

  const totalPageNumber = useMemo(() => {
    if (opts.commentPageSize <= 0) {
      return 0;
    }
    if (!issueInfo || issueInfo.comments <= 0) {
      return 0;
    }
    return Math.ceil(issueInfo.comments / opts.commentPageSize);
  }, [opts.commentPageSize, issueInfo]);

  /**
   * 无状态函数
   * @param pageNumber
   */
  const requestComments = async (pageNumber: number) => {
    setCommentLoading(true);
    const apiUrl = `${issueInfo.comments_url}?page=${pageNumber}&per_page=${opts.commentPageSize}`;
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
    initLoading,
    initError,
    commentLoading,
    totalPageNumber,
    comments,
    requestComments,
  };
};

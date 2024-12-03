import * as dayjs from 'dayjs';

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

/**
 *
 * 由于GitHub REST API无法对issue的comments进行创建时间排序获取
 * 封装如下方法始终获取按创建时间倒数前n条评论
 * 已知issue下的comment的总条数为len，倒数前n条数据的计算方式为：
 * 首先得到总页数：page_count = Math.ceil(n / len)；
 * 情况1:若len能被n除尽，那么倒数前n条就是最后一页数据，因此 page_size = n, page_num = page_count
 * 情况2:若len无法被n除尽，说明最后一页不满n条，因为我们需要请求最后一页以及倒数第二页数据，但我们可以将其合成为：
 * page_size = n * 2，page_num = page_count - 1（按照两倍容量请求倒数第二页）
 * 上述两种场景得到结果就是能够拿到倒数至少前n条数据（情况2会拿到多于n条的数据）
 * 得到数据以后在客户端进行按照创建时间降序排列，再取前n条数据
 */
export const getCommentsWithTargetIssue = async (
  params: {
    owner: string;
    repo: string;
    issueNumber: number;
    totalCommentLen: number;
    commentLatestSize: number;
  },
  headers: HeadersInit,
): Promise<IssueComment[]> => {
  const { owner, repo, issueNumber, totalCommentLen, commentLatestSize } = params;
  const pageCount = Math.ceil(totalCommentLen / commentLatestSize);
  let pageSize: number;
  let pageNum: number;
  if (totalCommentLen <= commentLatestSize) {
    pageSize = commentLatestSize;
    pageNum = 1;
  } else if (totalCommentLen % commentLatestSize === 0) {
    pageSize = commentLatestSize;
    pageNum = pageCount;
  } else {
    pageSize = commentLatestSize * 2;
    pageNum = pageCount - 1;
  }
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments?page=${pageNum}&per_page=${pageSize}`;
  let resp: Response;
  try {
    resp = await fetch(url, {
      headers: {
        ...headers,
      },
    });
  } catch (e) {
    throw new Error(
      `获取仓库（${owner}/${resp}）下指定issue评论失败：${e.message}`,
    );
  }
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }
  const issueComments = ((await resp.json()) as IssueComment[]) || [];
  return issueComments
    .sort((a, b) => {
      return b.created_at.localeCompare(a.created_at);
    })
    .slice(0, commentLatestSize);
};

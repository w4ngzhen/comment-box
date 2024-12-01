export interface Issue {
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

export async function getIssueWithTargetLabel(
  owner: string,
  repo: string,
  issueLabel: string,
): Promise<Issue> {
  let resp: Response;
  try {
    let getIssueUrl = `https://api.github.com/repos/${owner}/${repo}/issues?labels=${issueLabel}&state=all`;
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

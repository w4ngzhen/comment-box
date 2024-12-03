interface Params {
  owner: string;
  repo: string;
  issueNumber: number;
  comment: string;
  accessToken: string;
}

export async function addCommentToIssue(params: Params) {
  const { owner, repo, issueNumber, comment, accessToken } = params;
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      body: comment,
    }),
  };

  let response: Response;
  try {
    response = await fetch(url, options);
    const data = await response.json();
    console.log('Comment added successfully:', data);
  } catch (error) {
    console.error('Error adding comment:', error);
  }
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

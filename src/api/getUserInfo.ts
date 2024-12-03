export interface UserInfo {
  avatar_url: string;
  login: string;
  name: string;
  home_url: string;
}

export const getUserInfo = async (accessToken: string) => {
  let response: Response;
  try {
    response = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  } catch (e) {
    console.error('Get user info failed', e);
    throw new Error(`Failed to fetch user: ${e.message}`);
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.ok}`);
  }
  return (await response.json()) as UserInfo;
};

import { useEffect, useState } from 'preact/compat';
import { getIssueWithTargetLabel, Issue } from '../api';

export const useIssue = (params: {
  owner: string;
  repo: string;
  issueLabel: string;
}): { issue: Issue; loading: boolean; error: string } => {
  const { owner, repo, issueLabel } = params;
  const [issue, setIssue] = useState<Issue>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (!owner || !repo || !issueLabel) {
      return;
    }
    (async function load() {
      try {
        setLoading(true);
        const _issue = await getIssueWithTargetLabel(owner, repo, issueLabel);
        setIssue(_issue);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [owner, repo, issueLabel]);
  return {
    issue,
    loading,
    error,
  };
};

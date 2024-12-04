import { useEffect, useState } from 'preact/compat';
import { getIssueWithTargetLabel, Issue } from '../api/getIssueWithTargetLabel';

export const useIssue = (
  options: Options,
): { issue: Issue; loading: boolean; error: string } => {
  const { owner, repo, issueKey } = options;
  const [issue, setIssue] = useState<Issue>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (!owner || !repo || !issueKey) {
      return;
    }
    (async function load() {
      try {
        setLoading(true);
        const _issue = await getIssueWithTargetLabel(owner, repo, issueKey);
        setIssue(_issue);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [owner, repo, issueKey]);
  return {
    issue,
    loading,
    error,
  };
};

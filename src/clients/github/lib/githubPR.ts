export function parsePRUrl(prUrl: string): {
  owner: string;
  repo: string;
  pullNumber: number;
} {
  const normalizedUrl = prUrl.endsWith('/') ? prUrl.slice(0, -1) : prUrl;

  const urlParts = normalizedUrl.split('/');
  const pullNumberStr = urlParts.pop() ?? '';

  if (urlParts.pop() !== 'pull') {
    throw new Error(`Invalid GitHub PR URL: ${prUrl}`);
  }

  const repo = urlParts.pop() ?? '';
  const owner = urlParts.pop() ?? '';
  const pullNumber = parseInt(pullNumberStr);

  if (!owner || !repo || isNaN(pullNumber)) {
    throw new Error(`Invalid GitHub PR URL: ${prUrl}`);
  }
  return { owner, repo, pullNumber };
}

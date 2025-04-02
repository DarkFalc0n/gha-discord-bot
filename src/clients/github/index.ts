import { Octokit } from 'octokit';
import { config } from '@/utils/env';
import { parsePRUrl } from './lib/githubPR';

export class GithubRestClient {
  private static readonly _client = new Octokit({
    auth: config.GITHUB_TOKEN,
  });

  private static _instance: GithubRestClient;

  /**
   * Private constructor prevents direct construction calls with the `new` operator.
   */
  private constructor() {}

  public static get instance(): GithubRestClient {
    if (!GithubRestClient._instance) {
      GithubRestClient._instance = new GithubRestClient();
    }
    return GithubRestClient._instance;
  }

  /**
   * Get all labels currently applied to a specific pull request
   * @param prUrl GitHub pull request URL
   * @returns Array of label objects from the specified PR
   */
  public async getPullRequestLabels(prUrl: string): Promise<
    Array<{
      id: number;
      name: string;
      color: string;
      description: string | null;
      url: string;
    }>
  > {
    const octokit = GithubRestClient._client;
    const { owner, repo, pullNumber } = parsePRUrl(prUrl);

    try {
      const { data: pullRequest } = await octokit.rest.issues.get({
        owner,
        repo,
        issue_number: pullNumber,
      });

      return pullRequest.labels.map((label: any) => ({
        id: label.id,
        name: label.name,
        color: label.color,
        description: label.description,
        url: label.url,
      }));
    } catch (error: any) {
      console.error(`Error fetching PR labels: ${error.message}`);
      throw new Error(`Failed to fetch PR labels: ${error.message}`);
    }
  }

  /**
   * Add labels to a specific pull request
   * @param prUrl GitHub pull request URL
   * @param labels Array of label names to add
   * @returns Response data from the GitHub API
   */
  public async addLabelsToPullRequest(
    prUrl: string,
    labels: string[]
  ): Promise<{ success: boolean; message: string }> {
    if (!labels || labels.length === 0) {
      throw new Error('No labels provided to add');
    }

    const octokit = GithubRestClient._client;
    const { owner, repo, pullNumber } = parsePRUrl(prUrl);

    try {
      await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number: pullNumber, // GitHub treats PR numbers as issue numbers for this endpoint
        labels,
      });

      return {
        success: true,
        message: `Successfully added labels: ${labels.join(', ')} to PR #${pullNumber}`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to add labels: ${error.message}`,
      };
    }
  }
}

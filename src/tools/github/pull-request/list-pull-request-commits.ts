import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { GitCommit } from "../../../types";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listPullRequestCommits = async (accessToken: string, owner: string, repository: string, prNumber: number, perPage: number, currentPage: number) => {
    const commits = await axios.get<Partial<GitCommit>[]>(apis.listPullRequestCommitsApi(owner, repository, prNumber, perPage, currentPage), buildHeader(accessToken));

    return commits.data.map(({sha, html_url}: Partial<GitCommit>) => ({
        sha: sha || '',
        url: html_url,
    }));
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listPRCommits,
        'Fetches commits in a specific GitHub pull request, page by page',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            prNumber: z.number().min(1).describe('The pull request number to list commits from'),
            perPage: z.number().min(1).max(100).default(30).describe('Maximum number of commits to return per page (max: 100)'),
            currentPage: z.number().min(1).default(1).describe('Page number of the results to fetch. Start with 1 and increment until the returned list is empty'),
        },
        async ({owner, repository, prNumber, perPage, currentPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const commits = await listPullRequestCommits(accessToken, owner, repository, prNumber, perPage, currentPage);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(commits, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to list pull request commits: ${error}`), tools.listPRCommits);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to list pull request commits ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}

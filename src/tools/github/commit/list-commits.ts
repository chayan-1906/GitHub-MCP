import { z } from "zod";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { sendError } from "mcp-utils/utils";
import { transport } from "../../../server";
import { tools } from "../../../utils/constants";
import { apis, buildHeader } from "../../../utils/apis";
import { getGitHubAccessToken } from "../../../services/OAuth";

const listCommits = async (accessToken: string, owner: string, repository: string, branch: string, perPage: number, currentPage: number) => {
    const commits = await axios.get(apis.listCommitsApi(owner, repository, branch, perPage, currentPage), buildHeader(accessToken));

    return commits.data.map((commit: any) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author?.name,
        date: commit.commit.author?.date,
        url: commit.html_url,
    }));
}

export const registerTool = (server: McpServer) => {
    server.tool(
        tools.listCommits,
        'Fetches commits in a branch of a GitHub repository, page by page',
        {
            owner: z.string().describe('GitHub username or organization that owns the repository'),
            repository: z.string().describe('The name of the GitHub Repository'),
            branch: z.string().describe('The name of the branch to list commits from'),
            perPage: z.number().min(1).max(100).default(30).describe('Maximum number of repositories to return per page (max: 100)'),
            currentPage: z.number().min(1).default(1).describe('Page number of the results to fetch. Start with 1 and increment until the returned list is empty'),
        },
        async ({owner, repository, branch, perPage, currentPage}) => {
            const {accessToken, response: {content}} = await getGitHubAccessToken();
            if (!accessToken) return {content};

            try {
                const commits = await listCommits(accessToken, owner, repository, branch, perPage, currentPage);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(commits, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                sendError(transport, new Error(`Failed to list commits: ${error}`), tools.listCommits);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Failed to list commits ❌: ${error.message}`,
                        },
                    ],
                };
            }
        },
    );
}
